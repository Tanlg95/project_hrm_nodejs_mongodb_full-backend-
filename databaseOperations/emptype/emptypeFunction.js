const connectString = require('../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../other/supportFunction');
// const status = require("../../other/supportStatus").status;
// const objectIdmg = require('mongodb').ObjectId;
// const validateSupport = require('../../other/supportValidateSchema');
// const momentJS = require('moment');
const dbName = "humanproject";

// get max emptype

async function getmaxempType(todate)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_empType = 'tblempType';
    const castDate = functionSupport.castDate;
    const now = new Date();
    todate = (!(Date.parse(todate))) ? castDate(now,0) : castDate(todate,0);
    try {
    const collempType = await db.collection(tblname_empType).aggregate([
        {
            $match:{
                dateChange: {$lte: castDate(todate,0)}
            }
        },
        {
            $setWindowFields:{
                partitionBy: "$employeeId",
                sortBy: {dateChange: -1},
                output:{
                    maxdateChange: {$max: "$dateChange"}
                }
            }
        },
        {
            $match:{
                $expr:{
                    $eq:["$dateChange","$maxdateChange"]
                }
            }
        },
        {
            $lookup:{
                from:"tblref_empType",
                localField: "empTypeId",
                foreignField:"empTypeId",
                as:"result"
            }
        },
        {
            $addFields:{
                empTypeName:{
                    $arrayElemAt:["$result.empTypeName",0]
                }
            }
        },{
            $project:{
                _id: 0,
                maxadateChange: 0,
                result: 0
            }
        },
    ]).toArray();
    return collempType;       
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}

// caculate total employee for each employee's type

async function totalEmployeeByEmpType(todate)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_empType = 'tblempType';
    const tblname_ref = 'tblref_empType';
    const castDate = functionSupport.castDate;
    const now = new Date();
    todate = (!(Date.parse(todate))) ? castDate(now,0) : castDate(todate,0);

    try {
    // get all emptype with default totalemp = 0
    const collref_type = await db.collection(tblname_ref).aggregate([
        {
            $project:{
                _id: 0,
                empTypeId: 1,
                empTypeName: 1
            }
        },
        {
            $addFields:{
                totalemp: 0
            }
        }
    ]).toArray();
    // count total employee for each employee's type
    const collempType = await db.collection(tblname_empType).aggregate([
            {
                $match:{
                    dateChange: {$lte: castDate(todate,0)}
                }
            },
            {
                $setWindowFields:{
                    partitionBy:"$employeeId",
                    sortBy: {dateChange: -1},
                    output: {
                        maxdateChange: {$max:"$dateChange"}
                    }
                }
            },
            {
                $match:{
                    $expr:{
                        $eq:["$dateChange","$maxdateChange"]
                    }
                }
            }
            ,
            {
                $group:{
                    _id: "$empTypeId",
                    totalEmployee: {
                        $count:{}
                    }
                }
            },
            {
                $lookup:{
                    from:"tblref_empType",
                    localField:"_id",
                    foreignField:"empTypeId",
                    pipeline:[
                        {
                            $project:{
                                _id:0,
                                empTypeName:1
                            }
                        }
                    ],
                    as:"result"
                }
            },
            {
                $addFields:{
                    empTypeName:{ $arrayElemAt:["$result.empTypeName",0]}
                }
            },
            {
                $project:{
                    result: 0
                }
            }
    ]).toArray();
    // format employee's type
    const respone = collref_type.map(ele => ({
        empTypeId: ele.empTypeId,
        empTypeName: ele.empTypeName,
        totalemp: Number(((collempType.filter(eleInner => eleInner._id === ele.empTypeId)).length > 0) ? (collempType.filter(eleInner => eleInner._id === ele.empTypeId))[0].totalEmployee : 0 )
    }));
    return respone;
    } catch (error) {
        console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}

module.exports = {
    getmaxempType: getmaxempType,
    totalEmployeeByEmpType: totalEmployeeByEmpType
}