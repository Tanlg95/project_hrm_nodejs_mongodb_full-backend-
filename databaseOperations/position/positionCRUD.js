const connectString = require('../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../other/supportFunction');
const status = require("../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../other/supportValidateSchema');
const dbName = "humanproject";

/////////////////---------------- position structure -----------------------/////////////////////
//#region 

//----------------------------- create position structure --------------------------------// begin
//#region 
async function createpositionStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblref_position = "tblref_position";
    const tblemppos = 'tblemppos';
    const collref_position = db.collection(tblref_position);
    //const colltblemppos = db.collection(tblemppos);
    // check data if exists
    const checkExists = await collref_position.find({}).project({_id:0}).toArray();
    //const checkExistsEmppos = await colltblemppos.find({}).project({_id:0,posId:1}).toArray();

    const checkExistsMap = [...checkExists].map(ele => ele.posId);
    const dataClient = body.body;    
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    let listDataForInsert = dataClient.filter((ele) => (checkExistsMap.includes(ele.posId))? false : true);
    
    const listDataForvalidateEmppos = ([...listDataForInsert].map(ele => ele.posId)).concat(checkExistsMap);
    //console.log(listDataForvalidateEmppos);
    try {
        await db.createCollection(tblref_position,{
            validator: {...validateSupport(tblref_position,null)}
        });
    } catch (error) {
        await db.command({
            collMod: tblref_position,
            validator: {...validateSupport(tblref_position,null)}
        })
    }
    try {
        await db.createCollection(tblemppos,{
            validator: {...validateSupport(tblemppos,listDataForvalidateEmppos)}
        });
    } catch (error) {
        await db.command({
            collMod: tblemppos,
            validator: {...validateSupport(tblemppos,listDataForvalidateEmppos)}
        })
    }
    await collref_position.createIndex({posId:1});
    
    try {
   
    if(listDataForInsert.length === 0) return status(0,0);
    //console.log(listDataForInsert);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            posId: current.posId,
            posName: current.posName,
            note: current.note
        })
        return value;
    },[]);
    const listpositionStructure = await collref_position.insertMany(dataForInsert);
    return listpositionStructure;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- create position structure --------------------------------// end

//----------------------------- update position structure --------------------------------// begin
//#region 
async function updatepositionStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblref_position = 'tblref_position';
    const collref_position = db.collection(tblref_position);
    // let getListEmpPos = await db.collection('tblemppos').find({}).project({_id:0, posId: 1}).toArray();
    // getListEmpPos = getListEmpPos.map(ele => ele.posId);

    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;    
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    //const dataClientFilter = [...dataClient].filter(ele => getListEmpPos.includes(ele.posId)? false: true);
    //const dataClientFilteUpdateAll = [...dataClient].filter(ele => ([...dataClientFilter].map(eleInner => eleInner.posId)).includes(ele.posId)? false: true);

    for(let current of dataClient)
    {
     const filter = {'posId' : current.posId};
     const listDataUpdate = 
        {   
        $set:{
            //posId: current.posId,
            posName: current.posName,
            note: current.note
        }
        };
    //console.log(listDataUpdate);
    const respone = await collref_position.updateOne(filter,listDataUpdate);
    totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;
    }
    //update all 
    //#region 
    // for(let current of dataClientFilteUpdateAll)
    // {
    //  const filter = {'posId' : current.posId};
    //  const listDataUpdate = 
    //     {   
    //     $set:{
    //         posId: current.posId,
    //         posName: current.posName,
    //         note: current.note
    //     }
    //     };
    // //console.log(listDataUpdate);
    // const respone = await collref_position.updateOne(filter,listDataUpdate);
    // totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;
    // }
    //#endregion
    
    return status(totalRowsAffect,1);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- update position structure --------------------------------// end

//----------------------------- delete position structure --------------------------------// begin
//#region 
async function deletepositionStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblref_position = 'tblref_position', tblemppos = 'tblemppos';
    const getListEmpPos = await db.collection(tblemppos).find({}).project({_id:0, posId: 1}).toArray();
    const getlistref_pos = await db.collection(tblref_position).find({}).project({_id:0, posId: 1}).toArray();
    const getListEmpPosMap = [...getListEmpPos].map(ele => ele.posId);
    const dataClient = body.body;
    let totalRowsAffect = 0;
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    const dataClientFilter = ([...dataClient].filter(ele => getListEmpPosMap.includes(ele.posId)? false : true)).
    filter(eleInner => ([...getlistref_pos].map(eleInner2 => eleInner2.posId)).includes(eleInner.posId));

    const listref_pos_validate = [...getlistref_pos].filter(ele => ([...dataClientFilter].map(eleInner => eleInner.posId)).includes(ele.posId)? false : true );

    const validateSchemaempPos = {...validateSupport(tblemppos,listref_pos_validate)}
    await db.command({
        collMod: tblemppos,
        validator: validateSchemaempPos
    });

    try {
    if(dataClientFilter.length === 0) return status(0,2);
    for(let ele of dataClientFilter)
    {
        const dataForDelete = {
            posId: ele.posId
        }
        const respone = await db.collection(tblref_position).deleteOne(dataForDelete);
        totalRowsAffect += (respone.deletedCount === 1)? 1 :0 ;
    }
    return status(totalRowsAffect,2);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
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
    const db = connect.db(dbName);
    const tblref_position = 'tblref_position';
    const tblemppos = 'tblemppos';
    const coll = connect.db(dbName).collection(tblemppos);
    const getListRef_pos = await db.collection(tblref_position).find({}).project({_id:0,posId:1}).toArray();
    const getListRef_posMap = getListRef_pos.map(ele => ele.posId);
 
    const validateSchema = {...validateSupport(tblemppos,getListRef_posMap)};
    try {
        await db.createCollection(tblemppos,{
            validator: validateSchema
        });
    } catch (error) {
        //console.log(error);
        db.command({
            collMod: tblemppos,
            validator: validateSchema
        })
    };
    
    try {
    const dataClient = body.body;    
    if(!(dataClient instanceof Array)) throw new Error(`data must be an array!!!!`);
    // check data if exists
    const checkExists = await coll.find({}).toArray();
    const listEmployeeIdInDB = await db.collection('tblemployee').find().project({employeeId:1}).toArray();
    //const listDepIdInDB = await connect.db(dbName).collection('tblref_position').find().project({_id:0,depId:1}).toArray();
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
    //console.log(dataForInsert);
    const listEmployeeposition = await coll.insertMany(dataForInsert);
    return listEmployeeposition;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
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
    // const listPosIdInDB = await connect.db(dbName).collection('tblref_position').find().project({_id:0,depId:1}).toArray();
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
    let totalRowsAffect = 0;    
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
    const respone = await connect.db(dbName).collection('tblemppos').updateOne(filter,listDataUpdate);
    totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;
    console.log(totalRowsAffect);
    }
    return status(totalRowsAffect,1);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
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
    let totalRowsAffect = 0;
    if(!(dataClient instanceof Array)) throw new Error(`data must be an array!!!!`);
    for(let ele of dataClient)
    {
        const dataForDelete = {
            _id: new objectIdmg(ele._id)
        }
        const respone = await connect.db(dbName).collection('tblemppos').deleteOne(dataForDelete);
        totalRowsAffect += (respone.deletedCount === 1)? 1 :0 ;
    }
    return status(totalRowsAffect,2);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
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