const connectString = require('../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../other/supportFunction');
const status = require("../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../other/supportValidateSchema');
const momentJS = require('moment');
const dbName = "humanproject";

/////////////////---------------- type structure -----------------------/////////////////////
//#region 

//----------------------------- create type structure --------------------------------// begin
//#region 
async function createtypeStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_empType";
    const tblname_emp = 'tblempType';
    const collref_type = db.collection(tblname_ref);
    const colltblempType = db.collection(tblname_emp);
    // check data if exists
    const checkExists = await collref_type.find({}).project({_id:0,empTypeId: 1}).toArray();
    //const checkExistsEmppos = await colltblemppos.find({}).project({_id:0,posId:1}).toArray();
    const checkExistsMap = [...checkExists].map(ele => ele.empTypeId);
    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    let listDataForInsert = dataClient.filter((ele) => (checkExistsMap.includes(ele.empTypeId))? false : true);
    
    const listDataForvalidateEmpType = ([...listDataForInsert].map(ele => ele.empTypeId)).concat(checkExistsMap);
    //console.log(listDataForvalidateEmpType);
    try {
        await db.createCollection(tblname_ref,{
            validator: {...validateSupport(tblname_ref,null)}
        });
    } catch (error) {
        await db.command({
            collMod: tblname_ref,
            validator: {...validateSupport(tblname_ref,null)}
        })
    }
    try {
        await db.createCollection(tblname_emp,{
            validator: {...validateSupport(tblname_emp,listDataForvalidateEmpType)}
        });
    } catch (error) {
        await db.command({
            collMod: tblname_emp,
            validator: {...validateSupport(tblname_emp,listDataForvalidateEmpType)}
        })
    }
    await collref_type.createIndexes([{key:{empTypeId:1},name:"idx_emptype_empTypeId"}]);
    await colltblempType.createIndexes([{key:{employeeId:1,dateChange:-1,empTypeId: 1},name:"idx_empType_employeeId_dateChange_empTypeId"}]);
    
    try {
   
    if(listDataForInsert.length === 0) return status(0,0);
    //console.log(listDataForInsert);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            empTypeId: current.empTypeId,
            empTypeName: current.empTypeName,
            note: current.note
        })
        return value;
    },[]);
    const listtypeStructure = await collref_type.insertMany(dataForInsert);
    return listtypeStructure;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- create type structure --------------------------------// end

//----------------------------- update type structure --------------------------------// begin
//#region 
async function updatetypeStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = 'tblref_empType';
    const collref_type = db.collection(tblname_ref);
    const getListref_empType= await collref_type.find({}).project({_id: 0, empTypeId: 1}).toArray();

    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;    
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    // can not update document which's using by employee
    const dataClientFilter = dataClient.filter(ele => ([...getListref_empType].map(eleInner => eleInner.empTypeId)).includes(ele.empTypeId));
    //const dataClientFilteUpdateAll = [...dataClient].filter(ele => ([...dataClientFilter].map(eleInner => eleInner.posId)).includes(ele.posId)? false: true);
    //console.log(dataClientFilter);
    for(let current of dataClientFilter)
    {
     const filter = {'empTypeId' : current.empTypeId};
     const listDataUpdate = 
        {   
        $set:{
            empTypeName: current.empTypeName,
            note: current.note
        }
        };
    //console.log(listDataUpdate);
    const respone = await collref_type.updateOne(filter,listDataUpdate);
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
async function deletetypeStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = 'tblref_empType';
    const tblname_emp = 'tblempType';
    const collref_type = db.collection(tblname_ref);
    const colltblempType = db.collection(tblname_emp);
    const getListref_empType= await collref_type.find({}).project({_id: 0, empTypeId: 1}).toArray();
    const getListEmpType = await colltblempType.find({}).project({_id:0, empTypeId: 1}).toArray();
    const getListEmpTypeMap = [...getListEmpType].map(ele => ele.empTypeId);

    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;    
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    let dataClientFilter = [...dataClient].filter(ele => getListEmpTypeMap.includes(ele.empTypeId)? false: true );
    dataClientFilter = dataClientFilter.filter(ele => ([...getListref_empType].map(eleInner => eleInner.empTypeId)).includes(ele.empTypeId));
    //console.log(dataClientFilter);
    const validateSchemaref_empTypeList = ([...getListref_empType].map(ele => ele.empTypeId)).filter(
        eleInner => ([...dataClientFilter].map(eleInner2 => eleInner2.empTypeId).includes(eleInner)? false : true
    ));

    //console.log(validateSchemaref_empTypeList);
    const validateSchema = {...validateSupport(tblname_emp,validateSchemaref_empTypeList)};
    await db.command({
        collMod: tblname_emp,
        validator: validateSchema
    });

    if(dataClientFilter.length === 0) return status(0,2);
    for(let ele of dataClientFilter)
    {
        const dataForDelete = {
            empTypeId: ele.empTypeId
        }
        const respone = await collref_type.deleteOne(dataForDelete);
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
async function createEmployeetype(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = 'tblref_empType';
    const tblname_emp = 'tblempType';
    const tblname_employee = 'tblemployee';
    const collref_type = db.collection(tblname_ref);
    const colltblempType = db.collection(tblname_emp);
    const colltblemployee = db.collection(tblname_employee);
    const getListref_empType = await collref_type.find({}).project({_id: 0, empTypeId: 1}).toArray();
    const getListEmpType = await colltblempType.find({}).project({_id:0, employeeId: 1, dateChange: 1}).toArray();
    const getListref_empTypeMap = [...getListref_empType].map(ele => ele.empTypeId);

    const validateSchema = {...validateSupport(tblname_emp,getListref_empTypeMap)};
    try {
        await db.createCollection(tblname_emp,{
            validator: validateSchema
        });
    } catch (error) {
        //console.log(error);
        await db.command({
            collMod: tblname_emp,
            validator: validateSchema
        })
    };
    
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw new Error(`data must be an array!!!!`);

    const listEmployeeIdInDB = await colltblemployee.find().project({employeeId:1}).toArray();
    let listDataForInsert = dataClient.filter((ele) => ([...getListEmpType].some(
        eleInner => eleInner.employeeId === ele.employeeId && functionSupport.castDate(eleInner.dateChange,1) === functionSupport.castDate(ele.dateChange,1)
        ) === true)? false : true);
  
    listDataForInsert = (listDataForInsert.filter(ele => (listEmployeeIdInDB.map(eleInner => eleInner.employeeId)).includes(ele.employeeId))).
    filter(eleInner => getListref_empTypeMap.includes(eleInner.empTypeId));
   
    if(listDataForInsert.length === 0) return status(0,0);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            employeeId: current.employeeId,
            dateChange: functionSupport.castDate(current.dateChange,0),
            empTypeId: current.empTypeId,
            note: current.note
        })
        return value;
    },[]);
    const listEmployeetype = await colltblempType.insertMany(dataForInsert);
    return listEmployeetype;
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
async function updateEmployeetype(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = 'tblref_empType';
    const tblname_emp = 'tblempType';
    const tblname_employee = 'tblemployee';
    const collref_type = db.collection(tblname_ref);
    const colltblempType = db.collection(tblname_emp);
    const colltblemployee = db.collection(tblname_employee);
    const getListref_empType = await collref_type.find({}).project({_id: 0, empTypeId: 1}).toArray();
    const getListEmpType = await colltblempType.find({}).project({_id:0, employeeId: 1, dateChange: 1, empTypeId: 1}).toArray();
    const getListref_empTypeMap = [...getListref_empType].map(ele => ele.empTypeId);
    

    try {
    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    // get list emloyeeId in DB
    const listEmployeeIdInDB = await colltblemployee.find().project({employeeId:1}).toArray();
    // check valid employeeid from tblemployee
    let listDataForInsert = dataClient.filter(ele => ([...listEmployeeIdInDB].map(eleInner => eleInner.employeeId)).includes(ele.employeeId));
    // check valid duplicate data (employeeId, dateChange)
    listDataForInsert = listDataForInsert.filter((ele) => ([...getListEmpType].some(
        eleInner => eleInner.employeeId === ele.employeeId && 
        functionSupport.castDate(eleInner.dateChange,1) === functionSupport.castDate(ele.dateChange,1) &&
        eleInner.empTypeId === ele.empTypeId
        ) === true)? false : true);
    // check valid empTypeId
    listDataForInsert = listDataForInsert.filter(ele => getListref_empTypeMap.includes(ele.empTypeId));
    //console.log(listDataForInsert);
    let totalRowsAffect = 0;    
    for(let current of listDataForInsert)
    {
     const filter = {'_id' : new objectIdmg(current._id)};
     const listDataUpdate = 
        {   
        $set:{
            employeeId: current.employeeId,
            dateChange: functionSupport.castDate(current.dateChange,0),
            empTypeId: current.empTypeId,
            note: current.note
        }
        };
    const respone = await colltblempType.updateOne(filter,listDataUpdate);
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
async function deleteEmployeetype(body)
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
        const respone = await connect.db(dbName).collection('tblempType').deleteOne(dataForDelete);
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
    //--------------type structure---------------//
    createtypeStruct: createtypeStruct,
    updatetypeStruct: updatetypeStruct,
    deletetypeStruct: deletetypeStruct,

    //--------------employee's type--------------//
    createEmployeetype: createEmployeetype,
    updateEmployeetype: updateEmployeetype,
    deleteEmployeetype: deleteEmployeetype
};