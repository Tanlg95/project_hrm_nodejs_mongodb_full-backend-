const connectString = require('../../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../../other/supportFunction');
const status = require("../../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../../other/supportValidateSchema');
const momentJS = require('moment');
const employeeCRUD = require('../../masterData/employeeCRUD');
const { Double } = require('mongodb');
const dbName = "humanproject";
const statusRequest = require('../../../other/supportStatus').statusRequest;


/////////////////---------------- employee's allowanceFix -----------------------/////////////////////
//#region 

//----------------------------- create employee's allowanceFix --------------------------------// begin
//#region 
async function createEmployeeallowanceFix(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_allowance";
    const tblname_empall = 'tblempAllowanceFix';
    const tblname_employee = 'tblemployee';
    const collref_allowanceFix = db.collection(tblname_ref);
    const colltblempallowanceFix = db.collection(tblname_empall);
    const colltblemployee = db.collection(tblname_employee);

    const getlistref_allowanceFix = await collref_allowanceFix.distinct("allowanceId",{IsFix: true});
    const validateSchema = {...validateSupport(tblname_empall,getlistref_allowanceFix)};
    try {
        await db.createCollection(tblname_empall,{
            validator: validateSchema
        });
    } catch (error) {
        //console.log(error);
        await db.command({
            collMod: tblname_empall,
            validator: validateSchema
        })
    };
    
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;

    const listEmployeeIdInDB = await colltblemployee.find().project({employeeId:1}).toArray();
    const getListEmpallowanceFix = await colltblempallowanceFix.find({}).project({_id: 0, employeeId: 1, dateChange: 1}).toArray();

    let listDataForInsert = dataClient.filter((ele) => ([...getListEmpallowanceFix].some(
        eleInner => eleInner.employeeId === ele.employeeId && functionSupport.castDate(eleInner.dateChange,1) === functionSupport.castDate(ele.dateChange,1)
        ) === true)? false : true);
  
    listDataForInsert = (listDataForInsert.filter(ele => (listEmployeeIdInDB.map(eleInner => eleInner.employeeId)).includes(ele.employeeId))).
    filter(eleInner => getlistref_allowanceFix.includes(eleInner.allowanceId));
   
    if(listDataForInsert.length === 0) return status(0,0);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            employeeId: current.employeeId,
            dateChange: functionSupport.castDate(current.dateChange,0),
            allowanceId: current.allowanceId,
            amount: new Double(current.amount),
            note: current.note
        })
        return value;
    },[]);
    const listEmployeeallowanceFix = await colltblempallowanceFix.insertMany(dataForInsert);
    return listEmployeeallowanceFix;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- create employee's allowanceFix --------------------------------// end

//----------------------------- update employee's allowanceFix --------------------------------// begin
//#region 
async function updateEmployeeallowanceFix(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_allowance";
    const tblname_empall = 'tblempAllowanceFix';
    const tblname_employee = 'tblemployee';
    const collref_allowanceFix = db.collection(tblname_ref);
    const colltblempallowanceFix = db.collection(tblname_empall);
    const colltblemployee = db.collection(tblname_employee);
    
    try {
    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
    // get list ref allowanceFix
    const getlistref_allowanceFix = await collref_allowanceFix.distinct("allowanceId",{IsFix: true});
    // get list employee allowanceFix
    const getListEmpallowanceFix = await colltblempallowanceFix.find({}).project({_id: 1, employeeId: 1, dateChange: 1, allowanceId: 1}).toArray();
    // get list emloyeeId in DB
    const listEmployeeIdInDB = await colltblemployee.find().project({employeeId:1}).toArray();
    // check valid employeeid from tblemployee
    let listDataForInsert = dataClient.filter(ele => ([...listEmployeeIdInDB].map(eleInner => eleInner.employeeId)).includes(ele.employeeId));
    // check valid duplicate data (employeeId, dateChange)
    listDataForInsert = listDataForInsert.filter((ele) => ([...getListEmpallowanceFix].some(
        eleInner => eleInner.employeeId === ele.employeeId && 
        functionSupport.castDate(eleInner.dateChange,1) === functionSupport.castDate(ele.dateChange,1) &&
        eleInner.allowanceId === ele.allowanceId &&
        eleInner.amount === ele.amount
        ) === true)? false : true);
    // check valid empallowanceId
    listDataForInsert = listDataForInsert.filter(ele => getlistref_allowanceFix.includes(ele.allowanceId));
    //console.log(listDataForInsert);
    let totalRowsAffect = 0;    
    for(let current of listDataForInsert)
    {
     const filter = {'_id' : new objectIdmg(current._id)};
     const listDataUpdate = 
        {   
        $set:{
            employeeId: current.employeeId,
            dateChange: functionSupport.castDate(current.dateChange,0),
            allowanceId: current.allowanceId,
            amount: new Double(current.amount),
            note: current.note
        }
        };
    const respone = await colltblempallowanceFix.updateOne(filter,listDataUpdate);
    totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;
    //console.log(totalRowsAffect);
    }
    return status(totalRowsAffect,1);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- update employee's allowanceFix --------------------------------// end

//----------------------------- delete employee's allowanceFix --------------------------------// begin
//#region 
async function deleteEmployeeallowanceFix(body)
{
    const connect = await mongodb.connect(connectString);
    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    for(let ele of dataClient)
    {
        const dataForDelete = {
            _id: new objectIdmg(ele._id)
        }
        const respone = await connect.db(dbName).collection('tblempAllowanceFix').deleteOne(dataForDelete);
        totalRowsAffect += (respone.deletedCount === 1)? 1 :0 ;
    }
    return status(totalRowsAffect,2);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- delete employee's allowanceFix  --------------------------------// end


//#endregion


module.exports = {

    //--------------employee's allowanceFix--------------//
    createEmployeeallowanceFix: createEmployeeallowanceFix,
    updateEmployeeallowanceFix: updateEmployeeallowanceFix,
    deleteEmployeeallowanceFix: deleteEmployeeallowanceFix
};