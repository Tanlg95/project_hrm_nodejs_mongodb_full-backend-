
const connectString = require('../../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../../other/supportFunction');
const status = require("../../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../../other/supportValidateSchema');
const momentJS = require('moment');
const employeeCRUD = require('../../masterData/employeeCRUD');
const dbName = "humanproject";

// get max allowance
async function getmaxAllowane(todate)
{   
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_empall = 'tblempAllowance';
    const colltblempallowance = db.collection(tblname_empall);

    try {
    const getListEmpallowance = await colltblempallowance.aggregate([
        {
            $match:{
                dateChange: {$lte: functionSupport.castDate(todate,0)}
            }
        },
        {
            $setWindowFields:{
                partitionBy: {employeeId:"$employeeId", allowanceId:"$allowanceId"},
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
            $project:{
                _id: 0,
                maxdateChange: 0
            }
        }
    ]).toArray();
    
    return getListEmpallowance;
    } catch (error) {
    //console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
};

module.exports = 
{
    getmaxAllowane: getmaxAllowane
}