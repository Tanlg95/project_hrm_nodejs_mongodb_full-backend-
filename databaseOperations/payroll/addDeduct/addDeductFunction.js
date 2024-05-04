const connectString = require('../../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../../other/supportFunction');
// const status = require("../../../other/supportStatus").status;
// const objectIdmg = require('mongodb').ObjectId;
// const validateSupport = require('../../../other/supportValidateSchema');
// const momentJS = require('moment');
// const employeeCRUD = require('../../masterData/employeeCRUD');
// const { Double } = require('mongodb');
const dbName = "humanproject";

// get max add or deduct

async function getmaxaddDeduct(todate,ADopt)
{

    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_empadd = 'tblempAddDeduct';
    const colltblempAddDeduct = db.collection(tblname_empadd);
    try {
    if(!['A','D','*'].includes(ADopt)) throw new Error(`ADopt must be in ['A','D','*']`)
    const getListEmpAddDeduct = await colltblempAddDeduct.aggregate([
        {
            $match:{
                dateChange: {$lte: functionSupport.castDate(todate,0)},
                Type: (ADopt !== '*')? {$eq: ADopt } : { $exists: true }
            }
        },
        {
            $setWindowFields:{
                partitionBy:{employeeId:"$employeeId", Type:"$Type", addDeductId:"$addDeductId"},
                sortBy: {dateChange: -1},
                output: {
                    maxdateChange: {
                        $max: "$dateChange"
                    }
                }
            }
        },
        {
            $match:{
                $expr:{
                    $eq:["$maxdateChange","$dateChange"]
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
    
    return getListEmpAddDeduct;
    } catch (error) {
    console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
};

module.exports ={ 
    getmaxaddDeduct: getmaxaddDeduct
};