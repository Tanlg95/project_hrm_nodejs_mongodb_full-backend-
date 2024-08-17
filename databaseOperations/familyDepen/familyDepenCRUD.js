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
/////////////////---------------- relation structure -----------------------/////////////////////
//#region 

//----------------------------- create relation structure --------------------------------// begin
//#region 
async function createRelateStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_relation";
    const tblname_emp = 'tblempFamilyDepen';
    const collref = db.collection(tblname_ref);
    const colltblemp = db.collection(tblname_emp);
    // check data if exists
    const checkExists = await collref.distinct("relateId");

    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
    let listDataForInsert = dataClient.filter((ele) => (checkExists.includes(ele.relateId))? false : true);
    
    const listDataForvalidateEmpRelate = ([...listDataForInsert].map(ele => ele.relateId)).concat(checkExists);
    //console.log(listDataForvalidateEmpType);
    // try {
    //     await db.createCollection(tblname_ref,{
    //         validator: {...validateSupport(tblname_ref,null)}
    //     });
    // } catch (error) {
    //     await db.command({
    //         collMod: tblname_ref,
    //         validator: {...validateSupport(tblname_ref,null)}
    //     })
    // }
    // try {
    //     await db.createCollection(tblname_emp,{
    //         validator: {...validateSupport(tblname_emp,listDataForvalidateEmpRelate)}
    //     });
    // } catch (error) {
    //     await db.command({
    //         collMod: tblname_emp,
    //         validator: {...validateSupport(tblname_emp,listDataForvalidateEmpRelate)}
    //     })
    // }
    // await collref.createIndexes([{key:{relateId:1},name:"idx_ref_relation_relateId"}]);
    // await colltblemp.createIndexes([{key:{employeeId:1,perDepenIDcard: 1, fromdate: -1},name:"idx_familyDepen_employeeId_perDepenIDcard_relateId"}]);
    
    try {
   
    if(listDataForInsert.length === 0) return status(0,0);
    //console.log(listDataForInsert);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            relateId: current.relateId,
            relateName: current.relateName,
            note: current.note
        })
        return value;
    },[]);
    const listtypeStructure = await collref.insertMany(dataForInsert);
    return listtypeStructure;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- create relation structure --------------------------------// end

//----------------------------- update realation structure --------------------------------// begin
//#region 
async function updateRelateStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = 'tblref_relation';
    const collref = db.collection(tblname_ref);
    const getListref_relate = await collref.distinct('relateId');

    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;    
    if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
    // can not update document which's using by employee
    const dataClientFilter = dataClient.filter(ele => getListref_relate.includes(ele.relateId));
    //const dataClientFilteUpdateAll = [...dataClient].filter(ele => ([...dataClientFilter].map(eleInner => eleInner.posId)).includes(ele.posId)? false: true);
    //console.log(dataClientFilter);
    if (dataClientFilter.length === 0)  return status(totalRowsAffect,1);
    for(let current of dataClientFilter)
    {
     const filter = {'relateId' : current.relateId};
     const listDataUpdate = 
        {   
        $set:{
            relateName: current.relateName,
            note: current.note
        }
        };
    //console.log(listDataUpdate);
    const respone = await collref.updateOne(filter,listDataUpdate);
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
    // const respone = await collref_type.updateOne(filter,listDataUpdate);
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
//----------------------------- update type structure --------------------------------// end

//----------------------------- delete type structure --------------------------------// begin
//#region 
async function deleteRelateStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = 'tblref_relation';
    const tblname_emp = 'tblempFamilyDepen';
    const collref = db.collection(tblname_ref);
    const colltblemp = db.collection(tblname_emp);
    const getListref= await collref.distinct('relateId');
    const getListEmp = await colltblemp.distinct('relateId');

    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;    
    if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
    let dataClientFilter = [...dataClient].filter(ele => getListEmp.includes(ele.relateId)? false: true );
    dataClientFilter = dataClientFilter.filter(ele => getListref.includes(ele.relateId));
    //console.log(dataClientFilter);
    const validateSchemaref_emp = getListref.filter(
        eleInner => ([...dataClientFilter].map(eleInner2 => eleInner2.relateId).includes(eleInner)? false : true
    ));

    //console.log(validateSchemaref_empTypeList);
    const validateSchema = {...validateSupport(tblname_emp,validateSchemaref_emp)};
    // await db.command({
    //     collMod: tblname_emp,
    //     validator: validateSchema
    // });

    if(dataClientFilter.length === 0) return status(totalRowsAffect,2);
    for(let ele of dataClientFilter)
    {
        const dataForDelete = {
            relateId: ele.relateId
        }
        const respone = await collref.deleteOne(dataForDelete);
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
//----------------------------- delete type structure  --------------------------------// end
//#endregion



/////////////////---------------- employee's type -----------------------/////////////////////
//#region 

//----------------------------- create employee's type --------------------------------// begin
//#region 
async function createFamilyDepen(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = 'tblref_relation';
    const tblname_emp = 'tblempFamilyDepen';
    const tblname_employee = 'tblemployee';
    const collref = db.collection(tblname_ref);
    const colltblemp = db.collection(tblname_emp);
    const colltblemployee = db.collection(tblname_employee);
    const getListref = await collref.distinct('relateId');
    const getListEmp = await colltblemp.find({}).project({_id:0, employeeId: 1, perDepenIDcard: 1, fromdate: 1}).toArray();

    const validateSchema = {...validateSupport(tblname_emp,getListref)};
    // try {
    //     await db.createCollection(tblname_emp,{
    //         validator: validateSchema
    //     });
    // } catch (error) {
    //     //console.log(error);
    //     await db.command({
    //         collMod: tblname_emp,
    //         validator: validateSchema
    //     })
    // };
    
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;

    const listEmployeeIdInDB = await colltblemployee.distinct('employeeId');
    let listDataForInsert = dataClient.filter((ele) => ([...getListEmp].some(
        eleInner => eleInner.employeeId === ele.employeeId && 
        functionSupport.castDate(eleInner.fromdate,1) === functionSupport.castDate(ele.fromdate,1) &&
        eleInner.perDepenIDcard === ele.perDepenIDcard    
    ) === true)? false : true);
  
    listDataForInsert = (listDataForInsert.filter(ele => listEmployeeIdInDB.includes(ele.employeeId))).
    filter(eleInner => getListref.includes(eleInner.relateId));
   
    if(listDataForInsert.length === 0) return status(0,0);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            employeeId : current.employeeId,
            perDepenName : current.perDepenName,
            perDepenIDcard : current.perDepenIDcard,
            perDepenSI_Num : current.perDepenSI_Num,
            perDepenHI_Num : current.perDepenHI_Num,
            perDepenUI_Num : current.perDepenUI_Num,
            relateId : current.relateId,
            fromdate : functionSupport.castDate(current.fromdate,0),
            todate : functionSupport.castDate(current.todate,0),
            note : current.note
            
        })
        return value;
    },[]);
    const listFamilyDepen = await colltblemp.insertMany(dataForInsert);
    return listFamilyDepen;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- create employee's type --------------------------------// end

//----------------------------- update employee's type --------------------------------// begin
//#region 
async function updateFamilyDepen(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = 'tblref_relation';
    const tblname_emp = 'tblempFamilyDepen';
    const tblname_employee = 'tblemployee';
    const collref = db.collection(tblname_ref);
    const colltblemp = db.collection(tblname_emp);
    const colltblemployee = db.collection(tblname_employee);
    const getListref = await collref.distinct('relateId');
    const getListEmp = await colltblemp.find({}).project({_id:0, employeeId: 1, perDepenIDcard: 1, fromdate: 1}).toArray();

    try {
    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
    // get list emloyeeId in DB
    const listEmployeeIdInDB = await colltblemployee.distinct("employeeId");
    // check valid employeeid from tblemployee
    let listDataForInsert = dataClient.filter(ele => listEmployeeIdInDB.includes(ele.employeeId));
    // check valid duplicate data (employeeId, dateChange)
    listDataForInsert = listDataForInsert.filter((ele) => ([...getListEmp].some(
        eleInner => eleInner.employeeId === ele.employeeId && 
        functionSupport.castDate(eleInner.fromdate,1) === functionSupport.castDate(ele.fromdate,1) &&
        eleInner.relateId === ele.relateId
        ) === true)? false : true);
    // check valid relateId
    listDataForInsert = listDataForInsert.filter(ele => getListref.includes(ele.relateId));
    //console.log(listDataForInsert);
    let totalRowsAffect = 0;    
    for(let current of listDataForInsert)
    {
     const filter = {'_id' : new objectIdmg(current._id)};
     const listDataUpdate = 
        {   
        $set:{
            perDepenName : current.perDepenName,
            perDepenIDcard : current.perDepenIDcard,
            perDepenSI_Num : current.perDepenSI_Num,
            perDepenHI_Num : current.perDepenHI_Num,
            perDepenUI_Num : current.perDepenUI_Num,
            relateId : current.relateId,
            fromdate : functionSupport.castDate(current.fromdate,0),
            todate : functionSupport.castDate(current.todate,0),
            note : current.note
        }
        };
    const respone = await colltblemp.updateOne(filter,listDataUpdate);
    totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;
    //console.log(totalRowsAffect);
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
//----------------------------- update employee's type --------------------------------// end

//----------------------------- delete employee's type --------------------------------// begin
//#region 
async function deleteFamilyDepen(body)
{
    const connect = await mongodb.connect(connectString);
    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;
    if(!(dataClient instanceof Array)) statusRequest(0).message;
    for(let ele of dataClient)
    {
        const dataForDelete = {
            _id: new objectIdmg(ele._id)
        }
        const respone = await connect.db(dbName).collection('tblempFamilyDepen').deleteOne(dataForDelete);
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
//----------------------------- delete employee's type  --------------------------------// end


//#endregion


module.exports = {
    //--------------relation structure---------------//
    createRelateStruct: createRelateStruct,
    updateRelateStruct: updateRelateStruct,
    deleteRelateStruct: deleteRelateStruct,

    //--------------employee's relation--------------//
    createFamilyDepen: createFamilyDepen,
    updateFamilyDepen: updateFamilyDepen,
    deleteFamilyDepen: deleteFamilyDepen
};