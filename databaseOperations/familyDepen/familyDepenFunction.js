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


// get total depend family.

async function getmaxDepenFamily(todate)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblempFamilyDepen = 'tblempFamilyDepen';
    const collemp = db.collection(tblempFamilyDepen);
    try {
    const getlistDepen = await collemp.aggregate([
        {
            $match:{
                $expr:{
                    $and:[
                        {$lte:["$fromdate",functionSupport.castDate(todate,0)]},
                        {$gte:["$todate",functionSupport.castDate(todate,0)]}
                    ]
                }
            }
        },
        {
            $group:{
                _id: "$employeeId",
                totalDepend:{
                    $count:{}
                }
            }
        }
    ]).toArray();
    
    return getlistDepen;
    } catch (error) {
    console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
};


// get detail depend family.

async function getDetailDepenFamily(todate)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblempFamilyDepen = 'tblempFamilyDepen';
    const collemp = db.collection(tblempFamilyDepen);
    try {
    const getlistDepen = await collemp.aggregate([
        {
            $match:{
                $expr:{
                    $and:[
                        {$lte:["$fromdate",functionSupport.castDate(todate,0)]},
                        {$gte:["$todate",functionSupport.castDate(todate,0)]}
                    ]
                }
            }
        },
        {
            $group:{
                _id: "$employeeId",
                listDepend:{
                    $push:"$$ROOT"
                }
            }
        }
    ]).toArray();
    
    return getlistDepen;
    } catch (error) {
    console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
};



module.exports = {
    getmaxDepenFamily: getmaxDepenFamily,
    getDetailDepenFamily: getDetailDepenFamily
}