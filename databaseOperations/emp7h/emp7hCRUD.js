const connectString = require('../../databaseConnections/mongoDbConnection');
const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../other/supportFunction');
const status = require("../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const supportvalidateSchema = require('../../other/supportValidateSchema');
const dbName = 'humanproject';
const statusRequest = require('../../other/supportStatus').statusRequest;

// create operations
// begin
//#region 
async function createEmp7h(body)
{
    const connect = await mongodb.connect(connectString);
    const collName = 'tblemp7h';
    const collConnect = connect.db(dbName).collection(collName);
    try {
    const getTblEmp7h = await collConnect.aggregate([{
        $unset:["_id","note","todate"]
    }]).toArray();
    //console.log(getTblEmp7h);
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0);
    let filterData = dataClient;
        // remove duplilcate data
        if(getTblEmp7h.length > 0)
        {
            filterData = filterData.filter( ele => 
                {
                    const check = getTblEmp7h.findIndex((val) => val.employeeId === ele.employeeId &&
                            functionSupport.castDate(val.fromdate,1) === functionSupport.castDate(ele.fromdate,1) &&
                            val.isLate === ele.isLate
                    )  
                    if(check === -1)
                    return ele;
                }
            );     
        }
        // format data before insert
        filterData = filterData.map(ele => ({
            employeeId: ele.employeeId,
            fromdate: functionSupport.castDate(ele.fromdate,0),
            todate: functionSupport.castDate(ele.todate,0),
            isLate: ele.isLate,
            note: (!ele.note) ? null : ele.note
        }));

        if(filterData.length === 0) return status(0,0);
        const respone = await collConnect.insertMany(filterData);
        return respone;
    } catch (error) {
    console.log(error);
    throw error;  
    } finally{
    await connect.close();
    }
}

//#endregion
//end

// update operations
//begin
//#region 

async function udpateEmp7h(body)
{
    const connect = await mongodb.connect(connectString);
    const collName = 'tblemp7h';
    const collConnect = connect.db(dbName).collection(collName);
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0);    
    
    } catch (error) {
    console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}

//#endregion
//end

module.exports = {
    createEmp7h: createEmp7h,
    udpateEmp7h: udpateEmp7h,
}