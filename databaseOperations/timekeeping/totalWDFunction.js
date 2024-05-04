const { Decimal128, Int32 } = require('mongodb');
const connectString = require('../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../other/supportFunction');
const status = require("../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../other/supportValidateSchema');
const momentJS = require('moment');
const dbName = "humanproject";

// get total OT
async function getTotalOT(monthid, yearid)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_totalWD = 'tbltotalWD';
    const coll_totalWD = db.collection(tblname_totalWD);
    try {
    const getListTotalWD = await coll_totalWD.aggregate([
        {
            $match:{
                monthId: Number(monthid),
                yearId: Number(yearid)
            }
        },
        {
            $addFields:{
                totalOT: {
                 $add:[{$toDouble:"$OT15"},{$toDouble:"$OT20"},{$toDouble:"$OT30"},{$toDouble:"$OT30"},{$toDouble:"$OT15N"},{$toDouble:"$OT20N"},{$toDouble:"$OT30N"}]  
                }
            }
        },
        {
            $project:{
                _id:0,
                monthId: 1,
                yearId: 1,
                employeeId: 1,
                totalOT: 1
            }
        }
    ]).toArray();
    return getListTotalWD;
    } catch (error) {
    console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
};


// get total leave + WD
async function getTotalLeave(monthid, yearid)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_totalWD = 'tbltotalWD';
    const coll_totalWD = db.collection(tblname_totalWD);
    try {
    const getListTotalWD = await coll_totalWD.aggregate([
        {
            $match:{
                monthId: Number(monthid),
                yearId: Number(yearid)
            }
        },
        {
            $addFields:{
                totalLeave: {
                 $add:[{$toDouble:"$AL"},{$toDouble:"$PH"},{$toDouble:"$CL"},{$toDouble:"$KL"}]  
                },
                totalLeavePaid: {
                    $add:[{$toDouble:"$AL"},{$toDouble:"$PH"},{$toDouble:"$CL"}]  
                },
                totalLeaveUnPaid: {
                    $add:[{$toDouble:"$KL"}]  
                }
            }
        },
        {
            $project:{
                _id:0,
                monthId: 1,
                yearId: 1,
                employeeId: 1,
                AL: {$toDouble:"$AL"},
                PH: {$toDouble:"$PH"},
                CL: {$toDouble:"$CL"},
                KL: {$toDouble:"$KL"},
                totalLeave: 1,
                totalLeavePaid: 1,
                totalLeaveUnPaid: 1
            }
        }
    ]).toArray();
    return getListTotalWD;
    } catch (error) {
    console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
};

module.exports = {
    getTotalOT: getTotalOT,
    getTotalLeave: getTotalLeave
};