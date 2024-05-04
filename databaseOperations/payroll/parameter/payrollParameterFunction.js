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


// get list paramter 
async function getListparameter()
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_parameter = 'tblref_payrollParameter';
    const coll_parameter = db.collection(tblname_parameter);
    try {
    const getListparameter = await coll_parameter.find({}).project({_id: 0}).toArray();
    return getListparameter;
    } catch (error) {
    connect.log(error);
    throw error;
    } finally{
    await connect.close();
    }
};

module.exports = {
    getListparameter: getListparameter
};