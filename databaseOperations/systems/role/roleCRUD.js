const connectString = require('../../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../../other/supportFunction');
const status = require("../../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../../other/supportValidateSchema');
const dbName = "humanproject";
const statusRequest = require('../../../other/supportStatus').statusRequest;


//----------------------------------------- role's structure -------------------------------------// begin
//#region 

// create role's structure
//#region 
async function createRoleStructure(body)
{
    const connect = await mongodb.connect(connectString);
    const coll_ref = 'tblref_roles';
    const db = dbName;
    const dbConnect = connect.db(db);
    const collConnect = dbConnect.collection(coll_ref);
    const transactionOption = {
        ReadPreference: 'primary',
        ReadConcern: {level: 'local'},
        WriteConcern: {w: 'majority'}
    };
    // create collection and schema's validate
    const validateSchema = {...validateSupport(coll_ref,null)};
    // try {
    //     await dbConnect.createCollection(coll_ref,{
    //         validator: validateSchema
    //     });
    // } catch (error) {
    //     await dbConnect.command({
    //         collMod: coll_ref,
    //         validator: validateSchema
    //     }
    //     );
    // }
    // begin transactions
    const session = connect.startSession();
    // total row affect
    let totalRowsAffect = 0;
    try {
    const dataClient = body.body;
    let dataClientFilter = [...dataClient];
    // validate body input
    if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
    await session.withTransaction( async () => {
        
            const getListRoles = await collConnect.distinct('roleId');
            // validate duplicate
            dataClientFilter = dataClientFilter.filter( role => (getListRoles.includes(role.roleId) === true) ? false : true ); 
            // insert data 
            const respone = await collConnect.insertMany(dataClientFilter,{session});
            totalRowsAffect += (respone.insertedCount > 0) ? respone.insertedCount : 0;
            
    },transactionOption);
    return status(0,totalRowsAffect);

    } catch (error) {
    console.log(error);
    throw error;
    } finally{
        await session.endSession();
        await connect.close();
    }
}


//#endregion



//#endregion
//----------------------------------------- role's structure -------------------------------------// end


module.exports = {
    createRoleStructure: createRoleStructure
};