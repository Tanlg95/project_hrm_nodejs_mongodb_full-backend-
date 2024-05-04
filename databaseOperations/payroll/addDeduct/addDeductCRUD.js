const connectString = require('../../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../../other/supportFunction');
const status = require("../../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../../other/supportValidateSchema');
const momentJS = require('moment');
const employeeCRUD = require('../../masterData/employeeCRUD');
const { Double } = require('mongodb');
const dbName = "humanproject";

/////////////////---------------- AddDeduct structure -----------------------/////////////////////
//#region 

//----------------------------- create AddDeduct structure --------------------------------// begin
//#region 
async function createAddDeductStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_addDeduct";
    const tblname_empall = 'tblempAddDeduct';
    const collref_AddDeduct = db.collection(tblname_ref);
    const colltblempAddDeduct = db.collection(tblname_empall);

    // check data if exists
    const checkExists = await collref_AddDeduct.distinct("addDeductId");

    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    let listDataForInsert = dataClient.filter((ele) => (checkExists.includes(ele.addDeductId))? false : true);
    const listDataForvalidateEmpAddDeduct = ([...listDataForInsert].map(eleInner => eleInner.addDeductId)).concat(checkExists);
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
        await db.createCollection(tblname_empall,{
            validator: {...validateSupport(tblname_empall,listDataForvalidateEmpAddDeduct)}
        });
    } catch (error) {
        await db.command({
            collMod: tblname_empall,
            validator: {...validateSupport(tblname_empall,listDataForvalidateEmpAddDeduct)}
        })
    }
    
    await collref_AddDeduct.createIndexes([{key:{addDeductId:1},name:"idx_refempAddDeduct_addDeductId"}]);
    await colltblempAddDeduct.createIndexes([{key:{employeeId:1,dateChange:-1, addDeductId: 1},name:"idx_empAddDeduct_employeeId_dateChange_addDeductId"}]);

    try {
   
    if(listDataForInsert.length === 0) return status(0,0);
    //console.log(listDataForInsert);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            addDeductId: current.addDeductId,
            addDeductName: current.addDeductName,
            IsTax: Boolean(current.IsTax),
            note: current.note
        })
        return value;
    },[]);
    const listAddDeductStructure = await collref_AddDeduct.insertMany(dataForInsert);
    return listAddDeductStructure;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- create AddDeduct structure --------------------------------// end

//----------------------------- update AddDeduct structure --------------------------------// begin
//#region 
async function updateAddDeductStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_addDeduct";
    //const tblname_empall = 'tblempAddDeduct';
    const collref_AddDeduct = db.collection(tblname_ref);
    //const colltblempAddDeduct = db.collection(tblname_empall);

    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;    
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    //const getListEmpAddDeduct = await colltblempAddDeduct.distinct("allownaceId");
    // can not update isFix and isTax document which's using by employee
    //const dataClientFilter = dataClient.filter(ele => getListEmpAddDeduct.includes(ele.addDeductId));
    //console.log(dataClientFilter);
    for(let current of dataClient)
    {
     const filter = {'addDeductId' : current.addDeductId};
     const listDataUpdate = 
        {   
        $set:{
            addDeductName: current.addDeductName,
            IsTax: Boolean(current.IsTax),
            note: current.note
        }
        };
    //console.log(listDataUpdate);
    const respone = await collref_AddDeduct.updateOne(filter,listDataUpdate);
    totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;
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
//----------------------------- update AddDeduct structure --------------------------------// end

//----------------------------- delete AddDeduct structure --------------------------------// begin
//#region 
async function deleteAddDeductStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_addDeduct";
    const tblname_empad = 'tblempAddDeduct';
    const collref_AddDeduct = db.collection(tblname_ref);
    const colltblempAddDeduct = db.collection(tblname_empad);

    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;    
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    const getlistref_AddDeduct = await collref_AddDeduct.distinct("addDeductId");
    const getListEmpAddDeduct = await colltblempAddDeduct.distinct("addDeductId");


    // cant not delete AddDeductId which's using by employee
    let dataClientFilter = [...dataClient].filter(ele => getListEmpAddDeduct.includes(ele.addDeductId)? false: true );
    dataClientFilter = dataClientFilter.filter(ele => getlistref_AddDeduct.includes(ele.addDeductId));
    //console.log(dataClientFilter);
    //validate for tblempAddDeduct
    const validateSchemaAdArr = getlistref_AddDeduct.filter(
        eleInner => ([...dataClientFilter].map(eleInner2 => eleInner2.addDeductId)).includes(eleInner)? false : true
    );

    //console.log(validateSchemaref_empAddDeductList);
    const validateSchemaAll = {...validateSupport(tblname_empad,validateSchemaAdArr)};

    await db.command({
        collMod: tblname_empad,
        validator: validateSchemaAll
    });

    if(dataClientFilter.length === 0) return status(0,2);
    for(let ele of dataClientFilter)
    {
        const dataForDelete = {
            addDeductId: ele.addDeductId
        }
        const respone = await collref_AddDeduct.deleteOne(dataForDelete);
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
//----------------------------- delete AddDeduct structure  --------------------------------// end
//#endregion



/////////////////---------------- employee's AddDeduct -----------------------/////////////////////
//#region 

//----------------------------- create employee's AddDeduct --------------------------------// begin
//#region 
async function createEmployeeAddDeduct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_addDeduct";
    const tblname_empadd = 'tblempAddDeduct';
    const tblname_employee = 'tblemployee';
    const collref_AddDeduct = db.collection(tblname_ref);
    const colltblempAddDeduct = db.collection(tblname_empadd);
    const colltblemployee = db.collection(tblname_employee);

    const getlistref_AddDeduct = await collref_AddDeduct.distinct("addDeductId");
    const validateSchema = {...validateSupport(tblname_empadd,getlistref_AddDeduct)};
    try {
        await db.createCollection(tblname_empadd,{
            validator: validateSchema
        });
    } catch (error) {
        //console.log(error);
        await db.command({
            collMod: tblname_empadd,
            validator: validateSchema
        })
    };
    
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw new Error(`data must be an array!!!!`);

    const listEmployeeIdInDB = await colltblemployee.distinct("employeeId");
    const getListEmpAddDeduct = await colltblempAddDeduct.find({}).project({_id: 0, employeeId: 1, dateChange: 1}).toArray();

    let listDataForInsert = dataClient.filter((ele) => ([...getListEmpAddDeduct].some(
        eleInner => eleInner.employeeId === ele.employeeId && functionSupport.castDate(eleInner.dateChange,1) === functionSupport.castDate(ele.dateChange,1)
        ) === true)? false : true);
  
    listDataForInsert = (listDataForInsert.filter(ele => listEmployeeIdInDB.includes(ele.employeeId))).
    filter(eleInner => getlistref_AddDeduct.includes(eleInner.addDeductId));
   
    if(listDataForInsert.length === 0) return status(0,0);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            employeeId: current.employeeId,
            dateChange: functionSupport.castDate(current.dateChange,0),
            Type: current.Type,
            addDeductId: current.addDeductId,
            amount: new Double(current.amount),
            curType: current.curType,
            note: current.note
        })
        return value;
    },[]);
    console.log(dataForInsert); 
    const listEmployeeAddDeduct = await colltblempAddDeduct.insertMany(dataForInsert);
    return listEmployeeAddDeduct;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- create employee's AddDeduct --------------------------------// end

//----------------------------- update employee's AddDeduct --------------------------------// begin
//#region 
async function updateEmployeeAddDeduct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_addDeduct";
    const tblname_empadd = 'tblempAddDeduct';
    const tblname_employee = 'tblemployee';
    const collref_AddDeduct = db.collection(tblname_ref);
    const colltblempAddDeduct = db.collection(tblname_empadd);
    const colltblemployee = db.collection(tblname_employee);
    
    try {
    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    // get list ref AddDeduct
    const getlistref_AddDeduct = await collref_AddDeduct.distinct("addDeductId");
    // get list employee AddDeduct
    const getListEmpAddDeduct = await colltblempAddDeduct.find({}).project({_id: 1, employeeId: 1, dateChange: 1, addDeductId: 1, Type: 1}).toArray();
    // get list emloyeeId in DB
    const listEmployeeIdInDB = await colltblemployee.distinct("employeeId");
    // check valid employeeid from tblemployee
    let listDataForInsert = dataClient.filter(ele => [...listEmployeeIdInDB].includes(ele.employeeId));
    // check valid duplicate data (employeeId, dateChange)
    listDataForInsert = listDataForInsert.filter((ele) => ([...getListEmpAddDeduct].some(
        eleInner => eleInner.employeeId === ele.employeeId && 
        functionSupport.castDate(eleInner.dateChange,1) === functionSupport.castDate(ele.dateChange,1) &&
        eleInner.Type === ele.Type &&
        eleInner.addDeductId === ele.addDeductId &&
        eleInner.amount === ele.amount
        ) === true)? false : true);
    // check valid AddDeductId
    listDataForInsert = listDataForInsert.filter(ele => getlistref_AddDeduct.includes(ele.addDeductId));
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
            Type: current.Type,
            addDeductId: current.addDeductId,
            amount: new Double(current.amount),
            curType: current.curType,
            note: current.note
        }
        };
    const respone = await colltblempAddDeduct.updateOne(filter,listDataUpdate);
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
//----------------------------- update employee's AddDeduct --------------------------------// end

//----------------------------- delete employee's AddDeduct --------------------------------// begin
//#region 
async function deleteEmployeeAddDeduct(body)
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
        const respone = await connect.db(dbName).collection('tblempAddDeduct').deleteOne(dataForDelete);
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
//----------------------------- delete employee's AddDeduct  --------------------------------// end


//#endregion


module.exports = {
    //--------------AddDeduct structure---------------//
    createAddDeductStruct: createAddDeductStruct,
    updateAddDeductStruct: updateAddDeductStruct,
    deleteAddDeductStruct: deleteAddDeductStruct,

    //--------------employee's AddDeduct--------------//
    createEmployeeAddDeduct: createEmployeeAddDeduct,
    updateEmployeeAddDeduct: updateEmployeeAddDeduct,
    deleteEmployeeAddDeduct: deleteEmployeeAddDeduct
};