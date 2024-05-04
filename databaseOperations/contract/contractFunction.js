const connectString = require('../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../other/supportFunction');
const status = require("../../other/supportStatus").status;
//const objectIdmg = require('mongodb').ObjectId;
//const validateSupport = require('../../other/supportValidateSchema');
const momentJS = require('moment');
const dbName = "humanproject";


// get max contract

async function getmaxContract(todate)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_emp = 'tblempContract';
    const colltblempcontract = db.collection(tblname_emp);
    const castDate = functionSupport.castDate;
    try{
    // set default now if todate undefinded
    const now = new Date();
    todate = (!(Date.parse(todate))) ? castDate(now,0) : castDate(todate,0);
    const getListEmpContractFull = await colltblempcontract.aggregate([
        {$match: {
          fromdate:{$lte: castDate(todate,0)}
        }},
        {
          $setWindowFields: {
            partitionBy: "$employeeId",
            sortBy: {fromdate: -1},
            output: {
                  maxfromdate: {$max: "$fromdate"}
            }
          }
        },
        {
          $match: {
            $expr:{
                      $eq:["$fromdate","$maxfromdate"]
            }
          }
        },
        {
          $lookup: {
            from: "tblref_contractType",
            localField: "contractTypeId",
            foreignField: "contractTypeId",
            as: "contractInfo"
          }
        },
        {
              $addFields: {
                contractTypeName: {
              $arrayElemAt:["$contractInfo.contractTypeName",0]
            }
              }
        },
        {
          $project: {
            _id: 0,
            maxfromdate: 0,
            contractInfo: 0,
            //contractTypeId: 0
          }
        },
      ]).toArray();

    return getListEmpContractFull;
    
    } catch (error) {
        console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}

// auto renew contract 

async function renewContract(fromdate,todate,contractTypeIdv)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = 'tblref_contractType';
    const tblname_emp = 'tblempContract';
    const collref_contraction = db.collection(tblname_ref);
    const colltblempcontract = db.collection(tblname_emp);
    const getListref_contract= await collref_contraction.find({}).project({_id: 0, contractTypeId: 1, month: 1}).toArray();
    const getListEmpContractFull = await colltblempcontract.find({}).project({_id:0 ,employeeId: 1, fromdate: 1}).toArray();
    try {  
    // contract flow
    /*
    HDTV => HD2T => HD6T => HD1N => HD2N => HDKXD
    */
    const castDate = functionSupport.castDate;
    const getListEmpContract = await colltblempcontract.aggregate([

        {
            $match:{
                todate: {
                    $gte: castDate(fromdate,0),
                    $lte: castDate(todate,0),
                },
                contractTypeId: (contractTypeIdv !== '*')? contractTypeIdv : {$exists: true}
            }
        }
    ]).toArray();
    //console.log(getListEmpContract);

    let listDocument = [];
    for(let ele of [...getListEmpContract])
    {
        let nextContractTypeId = '';
        switch(ele.contractTypeId){
            case "HDTV":
                nextContractTypeId = 'HD2T';
                break;
            case "HD2T":
                nextContractTypeId = 'HD6T';
                break;
            case "HD6T":
                nextContractTypeId = 'HD1N';
                break;
            case "HD1N":
                nextContractTypeId = 'HD2N';
                break;
            case "HD2N":
                nextContractTypeId = 'HDKXD';
                break;
        }
        // if nextContractTypeId is empty => skip other step
        if(nextContractTypeId === '') continue;
        const month = Number((getListref_contract.filter(ele => ele.contractTypeId === nextContractTypeId))[0].month);
        //console.log(month);
        const newfromdate = momentJS(ele.todate,'YYYYMMDD').add(1,'day');
        const newtodate =  momentJS(newfromdate,'YYYYMMDD').add(month,'months');
        const document = {
            employeeId: ele.employeeId,
            fromdate: castDate(newfromdate.toISOString(),0),
            todate: (nextContractTypeId === 'HDKXD') ? null : castDate(newtodate.toISOString(),0),
            contractTypeId: nextContractTypeId,
            note: "generated automatic"
        }
        listDocument.push(document);
    }
    console.log(listDocument);
    // check valid duplicate data (employeeId, fromdate)
    const documentFilter  = [...listDocument].filter((ele) => ([...getListEmpContractFull].some(
        eleInner => eleInner.employeeId === ele.employeeId && castDate(eleInner.fromdate,1) === castDate(ele.fromdate,1)
        ) === true)? false : true);
    if(documentFilter.length === 0) return status(0,0);
    const respone = await colltblempcontract.insertMany(documentFilter);
    return respone;
    } catch (error) {
        console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
};

module.exports = {
    getmaxContract: getmaxContract,
    renewContract: renewContract
};