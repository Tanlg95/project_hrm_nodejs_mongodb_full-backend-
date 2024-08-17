const { Decimal128, Int32, Double } = require('mongodb');
const connectString = require('../../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../../other/supportFunction');
const status = require("../../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../../other/supportValidateSchema');
const momentJS = require('moment');
const { castDate } = require('../../../other/supportFunction');
const dbName = "humanproject";
const statusRequest = require('../../../other/supportStatus').statusRequest;


//----------------------------- create salary --------------------------------// begin
//#region 

async function createsalary(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_salary = 'tblempSalary';
    const coll_salary = db.collection(tblname_salary);
    const getListsalary = await coll_salary.find({}).project({_id:0, employeeId: 1, dateChange: 1}).toArray();
    

    const validateSchema = {...validateSupport(tblname_salary,null)};
    // try {
    // await db.createCollection(tblname_salary,{
    //     validator: validateSchema
    // });
    // } catch (error) {
    // await db.command({
    //     collMod: tblname_salary,
    //     validator: validateSchema
    // });
    // }
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    let dataClientFilter = dataClient.filter((ele) => (
        getListsalary.some(eleInner =>
            eleInner.employeeId === ele.employeeId &&
            castDate(eleInner.dateChange,1) === castDate(ele.dateChange,1)
        ) === true)?  false: true);

    if(dataClientFilter.length === 0) return status(0,0);
    dataClientFilter = dataClientFilter.map(ele =>({
        employeeId: ele.employeeId,
        dateChange: castDate(ele.dateChange,0),
        basicSalary: new Double(ele.basicSalary),
        curType: ele.curType,
        note: ele.note
    }));
    console.log(dataClientFilter);
    const respone = await coll_salary.insertMany(dataClientFilter);
    return respone;
    } catch (error) {
    //console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}

//----------------------------- create salary --------------------------------// end
//#endregion 


//----------------------------- update salary --------------------------------// begin
//#region 

async function updatesalary(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_salary = 'tblempSalary';
    const coll_salary = db.collection(tblname_salary);
    //const getListsalary = await coll_salary.find({}).project({_id:0, monthId: 1, yearId: 1, employeeId: 1}).toArray();
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    let totalRowsAffect = 0;
    for(let ele of dataClient )
    {
        const _id = {_id: new objectIdmg(ele._id)};
        const data = {
            $set:{
                employeeId: ele.employeeId,
                dateChange: castDate(ele.dateChange,0),
                basicSalary: new Double(ele.basicSalary),
                curType: ele.curType,
                note: ele.note
            }};
        const respone = await coll_salary.updateOne(_id,data);
        totalRowsAffect  += (respone.modifiedCount === 1)? 1: 0;
    }
    return status(totalRowsAffect,1);
    } catch (error) {
    //console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}

//----------------------------- update salary --------------------------------// end
//#endregion 


//----------------------------- update salary --------------------------------// begin
//#region 

async function deletesalary(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_salary = 'tblempSalary';
    const coll_salary = db.collection(tblname_salary);
    //const getListsalary = await coll_salary.find({}).project({_id:0, monthId: 1, yearId: 1, employeeId: 1}).toArray();
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    let totalRowsAffect = 0;
    for(let ele of dataClient )
    {
        const _id = {_id: new objectIdmg(ele._id)};
        const respone = await coll_salary.deleteOne(_id);
        totalRowsAffect  += (respone.deletedCount === 1)? 1: 0;
    }
    return status(totalRowsAffect,1);
    } catch (error) {
    //console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}

//----------------------------- update salary --------------------------------// end
//#endregion 

module.exports = {
    createsalary: createsalary,
    updatesalary: updatesalary,
    deletesalary: deletesalary
};