const { Double, Int32 } = require('mongodb');
const connectString = require('../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../other/supportFunction');
const status = require("../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../other/supportValidateSchema');
const momentJS = require('moment');
const dbName = "humanproject";
const statusRequest = require('../../other/supportStatus').statusRequest;


//----------------------------- create totalWD --------------------------------// begin
//#region 

async function createTotalWD(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_totalWD = 'tbltotalWD';
    const coll_totalWD = db.collection(tblname_totalWD);
    const getListTotalWD = await coll_totalWD.find({}).project({_id:0, monthId: 1, yearId: 1, employeeId: 1}).toArray();
    

    const validateSchema = {...validateSupport(tblname_totalWD,null)};
    try {
    await db.createCollection(tblname_totalWD,{
        validator: validateSchema
    });
    } catch (error) {
    await db.command({
        collMod: tblname_totalWD,
        validator: validateSchema
    });
    }
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    let dataClientFilter = dataClient.filter((ele) => (
        getListTotalWD.some(eleInner =>
            eleInner.employeeId === ele.employeeId &&
            Number(eleInner.monthId) === Number(ele.monthId) &&
            Number(eleInner.yearId) === Number(ele.yearId)
        ) === true)?  false: true);

    if(dataClientFilter.length === 0) return status(0,0);
    dataClientFilter = dataClientFilter.map(ele =>({
        monthId: new Int32(ele.monthId),
        yearId: new Int32(ele.yearId),
        employeeId: ele.employeeId,
        WD: new Double(ele.WD),
        WN: new Double(ele.WN),
        AL: new Double(ele.AL),
        PH: new Double(ele.PH),
        CL: new Double(ele.CL),
        KL: new Double(ele.KL),
        OT15: new Double(ele.OT15),
        OT20: new Double(ele.OT20),
        OT30: new Double(ele.OT30),
        OT15N: new Double(ele.OT15N),
        OT20N: new Double(ele.OT20N),
        OT30N: new Double(ele.OT30N),
        totalWD: new Double(ele.totalWD)
    }));

    const respone = await coll_totalWD.insertMany(dataClientFilter);
    return respone;
    } catch (error) {
    //console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}

//----------------------------- create totalWD --------------------------------// end
//#endregion 


//----------------------------- update totalWD --------------------------------// begin
//#region 

async function updateTotalWD(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_totalWD = 'tbltotalWD';
    const coll_totalWD = db.collection(tblname_totalWD);
    //const getListTotalWD = await coll_totalWD.find({}).project({_id:0, monthId: 1, yearId: 1, employeeId: 1}).toArray();
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    let totalRowsAffect = 0;
    for(let ele of dataClient )
    {
        const _id = {_id: new objectIdmg(ele._id)};
        const data = {
            $set:{
                monthId: new Int32(ele.monthId),
                yearId: new Int32(ele.yearId),
                employeeId: ele.employeeId,
                WD: new Double(ele.WD),
                WN: new Double(ele.WN),
                AL: new Double(ele.AL),
                PH: new Double(ele.PH),
                CL: new Double(ele.CL),
                KL: new Double(ele.KL),
                OT15: new Double(ele.OT15),
                OT20: new Double(ele.OT20),
                OT30: new Double(ele.OT30),
                OT15N: new Double(ele.OT15N),
                OT20N: new Double(ele.OT20N),
                OT30N: new Double(ele.OT30N),
                totalWD: new Double(ele.totalWD)
            }};
        const respone = await coll_totalWD.updateOne(_id,data);
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

//----------------------------- update totalWD --------------------------------// end
//#endregion 


//----------------------------- update totalWD --------------------------------// begin
//#region 

async function deleteTotalWD(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_totalWD = 'tbltotalWD';
    const coll_totalWD = db.collection(tblname_totalWD);
    //const getListTotalWD = await coll_totalWD.find({}).project({_id:0, monthId: 1, yearId: 1, employeeId: 1}).toArray();
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    let totalRowsAffect = 0;
    for(let ele of dataClient )
    {
        const _id = {_id: new objectIdmg(ele._id)};
        const respone = await coll_totalWD.deleteOne(_id);
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

//----------------------------- update totalWD --------------------------------// end
//#endregion 

module.exports = {
    createTotalWD: createTotalWD,
    updateTotalWD: updateTotalWD,
    deleteTotalWD: deleteTotalWD
};