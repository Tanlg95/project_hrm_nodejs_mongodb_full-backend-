const { Decimal128, Int32, Double } = require('mongodb');
const connectString = require('../../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../../other/supportFunction');
const status = require("../../../other/supportStatus").status;
// const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../../other/supportValidateSchema');
// const momentJS = require('moment');
// const { castDate } = require('../../../other/supportFunction');
const dbName = "humanproject";


//----------------------------- create parameter --------------------------------// begin
//#region 

async function createparameter(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_parameter = 'tblref_payrollParameter';
    const coll_parameter = db.collection(tblname_parameter);
    const getListparameter = await coll_parameter.distinct("paraId");
    

    const validateSchema = {...validateSupport(tblname_parameter,null)};
    try {
    await db.createCollection(tblname_parameter,{
        validator: validateSchema
    });
    } catch (error) {
    await db.command({
        collMod: tblname_parameter,
        validator: validateSchema
    });
    }
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw Error('dataClient must be an Array!!!');
    let dataClientFilter = dataClient.filter(ele => (getListparameter.includes(ele.paraId)) ? false : true );

    if(dataClientFilter.length === 0) return status(0,0);
    dataClientFilter = dataClientFilter.map(ele =>({
        paraId: ele.paraId,
        paraName: ele.paraName,
        value: (!Number(ele.value)) ? ele.value :  new Double(ele.value),
        note: ele.note
    }));
    console.log(dataClientFilter);
    const respone = await coll_parameter.insertMany(dataClientFilter);
    return respone;
    } catch (error) {
    //console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}

//----------------------------- create parameter --------------------------------// end
//#endregion 


//----------------------------- update parameter --------------------------------// begin
//#region 

async function updateparameter(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_parameter = 'tblref_payrollParameter';
    const coll_parameter = db.collection(tblname_parameter);
    const getListparameter = await coll_parameter.distinct("paraId");
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw Error('dataClient must be an Array!!!');
    const dataClientFilter = dataClient.filter(ele => (getListparameter.includes(ele.paraId) === true) ? true : false)
    let totalRowsAffect = 0;
    for(let ele of dataClientFilter )
    {
        const data = {
            $set:{
                paraName: ele.paraName,
                value: (!Number(ele.value)) ? ele.value :  new Double(ele.value),
                note: ele.note
            }};
        const respone = await coll_parameter.updateOne({paraId: ele.paraId},data);
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

//----------------------------- update parameter --------------------------------// end
//#endregion 


//----------------------------- delete parameter --------------------------------// begin
//#region 

async function deleteparameter(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_parameter = 'tblref_payrollParameter';
    const coll_parameter = db.collection(tblname_parameter);
    //const getListparameter = await coll_parameter.find({}).project({_id:0, monthId: 1, yearId: 1, employeeId: 1}).toArray();
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw Error('dataClient must be an Array!!!');
    let totalRowsAffect = 0;
    for(let ele of dataClient )
    {
        const respone = await coll_parameter.deleteOne({paraId: ele.paraId});
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

//----------------------------- delete parameter --------------------------------// end
//#endregion 

module.exports = {
    createparameter: createparameter,
    updateparameter: updateparameter,
    deleteparameter: deleteparameter
};