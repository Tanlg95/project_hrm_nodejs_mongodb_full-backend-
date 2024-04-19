const connectString = require('../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../other/supportFunction');
const status = require("../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;

/////////////////---------------- position structure -----------------------/////////////////////
//#region 

//----------------------------- create position structure --------------------------------// begin
//#region 
async function createpositionStruct(body)
{
    const connect = await mongodb.connect(connectString);
    await connect.db('humanproject').createCollection('tblref_position',{
        validator:{
            $jsonSchema:{
                bsonType:"object",
                required:["posId","posName","note"],
                properties:{
                    posId:{
                        bsonType:["string"],
                        maxLength:50,
                        description:"posId must be string"
                    },
                    posName:{
                        bsonType:["null","string"],
                        maxLength:250,
                        description:"posName must be string"
                    },
                    note:{
                        bsonType:["null","string"],
                        maxLength:250,
                        description:"note must be string"
                    }
                }
            }
        }
    });
    const coll = connect.db('humanproject').collection('tblref_position');
    await coll.createIndex({posId:1});
    try {
    const dataClient = body.body;    
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    // check data if exists
    const checkExists = await coll.find({}).toArray();
    let listDataForInsert = dataClient.filter((ele) => (checkExists.some(eleInner => eleInner.posId === ele.posId) === true)? false : true);
    if(listDataForInsert.length === 0) return status(0,0);
    console.log(listDataForInsert);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            posId: current.posId,
            posName: current.posName,
            note: current.note
        })
        return value;
    },[]);
    const listpositionStructure = await coll.insertMany(dataForInsert);
    return listpositionStructure;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        connect.close();
    }
}
//#endregion
//----------------------------- create position structure --------------------------------// end

//----------------------------- update position structure --------------------------------// begin
//#region 
async function updatepositionStruct(body)
{
    const connect = await mongodb.connect(connectString);
    try {
    const dataClient = body.body;
    let totalRowsAffect = body.body.length;    
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    for(let current of dataClient)
    {
     const filter = {'posId' : current.posId};
     const listDataUpdate = 
        {   
        $set:{
            posId: current.posId,
            posName: current.posName,
            note: current.note
        }
        };
    console.log(listDataUpdate);
    const respone = await connect.db('humanproject').collection('tblref_position').updateOne(filter,listDataUpdate);
    totalRowsAffect -= (respone.modifiedCount === 0)? 1 : 0;
    }
    return status(totalRowsAffect,1);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        connect.close();
    }
}
//#endregion
//----------------------------- update position structure --------------------------------// end

//----------------------------- delete position structure --------------------------------// begin
//#region 
async function deletepositionStruct(body)
{
    const connect = await mongodb.connect(connectString);
    try {
    const dataClient = body.body;
    let totalRowsAffect = dataClient.length;
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    for(let ele of dataClient)
    {
        const dataForDelete = {
            posId: ele.posId
        }
        const respone = await connect.db('humanproject').collection('tblref_position').deleteOne(dataForDelete);
        totalRowsAffect -= (respone.deletedCount === 0)? 1 :0 ;
    }
    return status(totalRowsAffect,2);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        connect.close();
    }
}
//#endregion
//----------------------------- delete position structure  --------------------------------// end
//#endregion



/////////////////---------------- employee's position -----------------------/////////////////////
//#region 

//----------------------------- create employee's position --------------------------------// begin
//#region 
async function createEmployeeposition(body)
{
    const connect = await mongodb.connect(connectString);
    const getListRef_pos = (await connect.db('humanproject').collection('tblref_position').find({}).project({_id:0,posId:1}).toArray()).map(
        ele => ele.posId
    );
    try {
        await connect.db('humanproject').createCollection('tblemppos',{
            validator:{
                $jsonSchema:{
                    bsonType:"object",
                    required:["employeeId","dateChange","posId","note"],
                    properties:{
                        employeeId:{
                            bsonType:"string",
                            minLength: 5,
                            maxLength: 30,
                            description:"employeeId must be string"
                        },
                        dateChange:{
                            bsonType:"date",
                            description:"dateChange must be date"
                        },
                        posId:{
                            bsonType:"string",
                            maxLength: 50,
                            enum: getListRef_pos, // list position id validate
                            description:"posId must be string"
                        },
                        note:{
                            bsonType:["null","string"],
                            maxLength: 250,
                            description:"note must be string"
                        },
                    }
                }
            }
        });
    } catch (error) {
        console.log(error);
        connect.db('humanproject').command({
            collMod:"tblemppos",
            validator:{
                $jsonSchema:{
                    bsonType:"object",
                    required:["employeeId","dateChange","posId","note"],
                    properties:{
                        employeeId:{
                            bsonType:"string",
                            minLength: 5,
                            maxLength: 30,
                            description:"employeeId must be string"
                        },
                        dateChange:{
                            bsonType:"date",
                            description:"dateChange must be date"
                        },
                        posId:{
                            bsonType:"string",
                            maxLength: 50,
                            enum: getListRef_pos, // list position id validate
                            description:"posId must be string"
                        },
                        note:{
                            bsonType:["null","string"],
                            maxLength: 250,
                            description:"note must be string"
                        },
                    }
                }
            }
        })
    };
    const coll = connect.db('humanproject').collection('tblemppos');
    try {
    const dataClient = body.body;    
    if(!(dataClient instanceof Array)) throw new Error(`data must be an array!!!!`);
    // check data if exists
    const checkExists = await coll.find({}).toArray();
    const listEmployeeIdInDB = await connect.db('humanproject').collection('tblemployee').find().project({employeeId:1}).toArray();
    //const listDepIdInDB = await connect.db('humanproject').collection('tblref_position').find().project({_id:0,depId:1}).toArray();
    let listDataForInsert = dataClient.filter((ele) => (checkExists.some(
        eleInner => eleInner.employeeId === ele.employeeId && functionSupport.castDate(eleInner.dateChange,1) === functionSupport.castDate(ele.dateChange,1)
        ) === true)? false : true);
    listDataForInsert = listDataForInsert.filter(ele => listEmployeeIdInDB.some(eleInner => ele.employeeId === eleInner.employeeId));
    // listDataForInsert = listDataForInsert.filter(ele => {

    //         let isNotMatched = 0;
    //         let listDep = ['sectionId','lineId','groupId','teamId','partId'];
    //         for(let i = 0 ; i < 5 ; ++i)
    //         {
    //             if(listDepIdInDB.some(eleDep => (ele[listDep[i]] === null) ? true : ele[listDep[i]] === eleDep.depId) === false)
    //             isNotMatched = 1;   
    //         }
    //         return (isNotMatched === 0)? true: false;
    // });
    if(listDataForInsert.length === 0) return status(0,0);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            employeeId: current.employeeId,
            dateChange: new Date(current.dateChange),
            posId: current.posId,
            note: current.note
        })
        return value;
    },[]);
    console.log(dataForInsert);
    const listEmployeeposition = await coll.insertMany(dataForInsert);
    return listEmployeeposition;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        connect.close();
    }
}
//#endregion
//----------------------------- create employee's position --------------------------------// end

//----------------------------- update employee's position --------------------------------// begin
//#region 
async function updateEmployeeposition(body)
{
    const connect = await mongodb.connect(connectString);
    try {
    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    // const listPosIdInDB = await connect.db('humanproject').collection('tblref_position').find().project({_id:0,depId:1}).toArray();
    // const dataClientFilter = dataClient.filter(ele => {
    //     let isNotMatched = 0;
    //     let listDep = ['sectionId','lineId','groupId','teamId','partId'];
    //     for(let i = 0 ; i < 5 ; ++i)
    //     {
    //         if(listDepIdInDB.some(eleDep => (ele[listDep[i]] === null) ? true : ele[listDep[i]] === eleDep.depId) === false)
    //         isNotMatched = 1;   
    //     }
    //     return (isNotMatched === 0)? true: false;
    // });
    let totalRowsAffect = dataClient.length;    
    for(let current of dataClient)
    {
     const filter = {'_id' : new objectIdmg(current._id)};
     const listDataUpdate = 
        {   
        $set:{
            dateChange: new Date(current.dateChange),
            posId: current.posId,
            note: current.note
        }
        };
    const respone = await connect.db('humanproject').collection('tblemppos').updateOne(filter,listDataUpdate);
    totalRowsAffect -= (respone.modifiedCount === 0)? 1 : 0;
    console.log(totalRowsAffect);
    }
    return status(totalRowsAffect,1);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        connect.close();
    }
}
//#endregion
//----------------------------- update employee's position --------------------------------// end

//----------------------------- delete employee's position --------------------------------// begin
//#region 
async function deleteEmployeeposition(body)
{
    const connect = await mongodb.connect(connectString);
    try {
    const dataClient = body.body;
    let totalRowsAffect = dataClient.length;
    if(!(dataClient instanceof Array)) throw new Error(`data must be an array!!!!`);
    for(let ele of dataClient)
    {
        const dataForDelete = {
            _id: new objectIdmg(ele._id)
        }
        const respone = await connect.db('humanproject').collection('tblemppos').deleteOne(dataForDelete);
        totalRowsAffect -= (respone.deletedCount === 0)? 1 :0 ;
    }
    return status(totalRowsAffect,2);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        connect.close();
    }
}
//#endregion
//----------------------------- delete employee's position  --------------------------------// end


//#endregion


module.exports = {
    //--------------position structure---------------//
    createpositionStruct: createpositionStruct,
    updatepositionStruct: updatepositionStruct,
    deletepositionStruct: deletepositionStruct,

    //--------------employee's position--------------//
    createEmployeeposition: createEmployeeposition,
    updateEmployeeposition: updateEmployeeposition,
    deleteEmployeeposition: deleteEmployeeposition
};