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
const statusRequest = require('../../../other/supportStatus').statusRequest;

/////////////////---------------- allowance structure -----------------------/////////////////////
//#region 

//----------------------------- create allowance structure --------------------------------// begin
//#region 
async function createallowanceStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_allowance";
    const tblname_empall = 'tblempAllowance';
    const tblname_empallFix = 'tblempAllowanceFix';
    const collref_allowance = db.collection(tblname_ref);
    const colltblempallowance = db.collection(tblname_empall);
    const colltblempallowanceFix = db.collection(tblname_empallFix);

    // check data if exists
    const checkExists = await collref_allowance.find({}).project({_id:0,allowanceId: 1, IsFix: 1}).toArray();
    
    const checkExistsMap = [...checkExists].map(ele => ele.allowanceId);
    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
    let listDataForInsert = dataClient.filter((ele) => (checkExistsMap.includes(ele.allowanceId))? false : true);
    
    const listDataForvalidateEmpallowance = (([...listDataForInsert].filter(ele => ele.IsFix === false)).map(eleInner => eleInner.allowanceId)).
    concat(([...checkExists].filter(eleInner2 => eleInner2.IsFix === false)).map(eleInner3 => eleInner3.allowanceId));
    const listDataForvalidateEmpallowanceFix = ([...listDataForInsert].filter(ele => ele.IsFix === true)).map(eleInner => eleInner.allowanceId).
    concat(([...checkExists].filter(eleInner2 => eleInner2.IsFix === true)).map(eleInner3 => eleInner3.allowanceId));;
    
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
    //     await db.createCollection(tblname_empall,{
    //         validator: {...validateSupport(tblname_empall,listDataForvalidateEmpallowance)}
    //     });
    // } catch (error) {
    //     await db.command({
    //         collMod: tblname_empall,
    //         validator: {...validateSupport(tblname_empall,listDataForvalidateEmpallowance)}
    //     })
    // }
    // try {
    //     await db.createCollection(tblname_empallFix,{
    //         validator: {...validateSupport(tblname_empallFix,listDataForvalidateEmpallowanceFix)}
    //     });
    // } catch (error) {
    //     await db.command({
    //         collMod: tblname_empallFix,
    //         validator: {...validateSupport(tblname_empallFix,listDataForvalidateEmpallowanceFix)}
    //     })
    // }
    // await collref_allowance.createIndexes([{key:{allowanceId:1},name:"idx_refempallowance_allowanceId"}]);
    // await colltblempallowance.createIndexes([{key:{employeeId:1,dateChange:-1, allowanceId: 1},name:"idx_empallowance_employeeId_dateChange_allowanceId"}]);
    // await colltblempallowanceFix.createIndexes([{key:{employeeId:1,dateChange:-1, allowanceId: 1},name:"idx_empallowanceFix_employeeId_dateChange_allowanceId"}]);

    
    try {
   
    if(listDataForInsert.length === 0) return status(0,0);
    //console.log(listDataForInsert);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            allowanceId: current.allowanceId,
            allowanceName: current.allowanceName,
            IsFix: Boolean(current.IsFix),
            IsTax: Boolean(current.IsTax),
            IsBH: Boolean(current.IsBH),
            note: current.note
        })
        return value;
    },[]);
    const listallowanceStructure = await collref_allowance.insertMany(dataForInsert);
    return listallowanceStructure;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- create allowance structure --------------------------------// end

//----------------------------- update allowance structure --------------------------------// begin
//#region 
async function updateallowanceStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_allowance";
    const tblname_empall = 'tblempAllowance';
    const tblname_empallFix = 'tblempAllowanceFix';
    const collref_allowance = db.collection(tblname_ref);
    const colltblempallowance = db.collection(tblname_empall);
    const colltblempallowanceFix = db.collection(tblname_empallFix);

    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;    
    if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
    const getListEmpallowance = await colltblempallowance.distinct("allownaceId");
    const getListEmpallowanceFix = await colltblempallowanceFix.distinct("allowanceId");
    const totalAllowIdCantUpdate = getListEmpallowance.concat(getListEmpallowanceFix);
    // can not update isFix and isTax document which's using by employee
    const dataClientFilter = dataClient.filter(ele => totalAllowIdCantUpdate.includes(ele.empallowanceId));
    // can update all
    const dataClientFilteUpdateAll = [...dataClient].filter(ele => ([...dataClientFilter].map(eleInner => eleInner.allowanceId)).includes(ele.allowanceId)? false: true);
    //console.log(dataClientFilter);
    for(let current of dataClientFilter)
    {
     const filter = {'allowanceId' : current.allowanceId};
     const listDataUpdate = 
        {   
        $set:{
            allowanceName: current.allowanceName,
            IsTax: Boolean(current.IsTax),
            IsBH: Boolean(current.IsBH),
            note: current.note
        }
        };
    //console.log(listDataUpdate);
    const respone = await collref_allowance.updateOne(filter,listDataUpdate);
    totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;
    }
    //update all 
    //#region 
    for(let current of dataClientFilteUpdateAll)
    {
     const filter = {'allowanceId' : current.allowanceId};
     const listDataUpdate = 
        {   
        $set:{
            allowanceName: current.allowanceName,
            IsFix: Boolean(current.IsFix),
            IsTax: Boolean(current.IsTax),
            IsBH: Boolean(current.IsBH),
            note: current.note
        }
        };
    //console.log(listDataUpdate);
    const respone = await collref_allowance.updateOne(filter,listDataUpdate);
    totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;
    }
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
//----------------------------- update allowance structure --------------------------------// end

//----------------------------- delete allowance structure --------------------------------// begin
//#region 
async function deleteallowanceStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_allowance";
    const tblname_empall = 'tblempAllowance';
    const tblname_empallFix = 'tblempAllowanceFix';
    const collref_allowance = db.collection(tblname_ref);
    const colltblempallowance = db.collection(tblname_empall);
    const colltblempallowanceFix = db.collection(tblname_empallFix);

    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;    
    if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
    const getlistref_allowance = await collref_allowance.find({}).project({_id:0 , allowanceId: 1, IsFix: 1}).toArray();
    const getListEmpallowance = await colltblempallowance.distinct("allownaceId");
    const getListEmpallowanceFix = await colltblempallowanceFix.distinct("allowanceId");
    const totalAllowIdCantUpdate = getListEmpallowance.concat(getListEmpallowanceFix);

    // cant not delete allowanceId which's using by employee
    let dataClientFilter = [...dataClient].filter(ele => totalAllowIdCantUpdate.includes(ele.empallowanceId)? false: true );
    dataClientFilter = dataClientFilter.filter(ele => ([...getlistref_allowance].map(eleInner => eleInner.allowanceId)).includes(ele.allowanceId));
    //console.log(dataClientFilter);
    //validate for tblempAllowance
    const validateSchemaAllArr = (([...getlistref_allowance].filter(eleOuter => eleOuter.IsFix === false)).map(ele => ele.allowanceId)).filter(
        eleInner => ([...dataClientFilter].map(eleInner2 => eleInner2.allowanceId).includes(eleInner)? false : true
    ));
    //validate for tblempAllowanceFix
    const validateSchemaAllFixArr= (([...getlistref_allowance].filter(eleOuter => eleOuter.IsFix === true)).map(ele => ele.allowanceId)).filter(
        eleInner => ([...dataClientFilter].map(eleInner2 => eleInner2.allowanceId).includes(eleInner)? false : true
    )); 

    //console.log(validateSchemaref_empallowanceList);
    const validateSchemaAll = {...validateSupport(tblname_empall,validateSchemaAllArr)};
    const validateSchemaAllFix = {...validateSupport(tblname_empallFix,validateSchemaAllFixArr)};
    // await db.command({
    //     collMod: tblname_empall,
    //     validator: validateSchemaAll
    // });
    // await db.command({
    //     collMod: tblname_empallFix,
    //     validator: validateSchemaAllFix
    // });

    if(dataClientFilter.length === 0) return status(0,2);
    for(let ele of dataClientFilter)
    {
        const dataForDelete = {
            allowanceId: ele.allowanceId
        }
        const respone = await collref_allowance.deleteOne(dataForDelete);
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
//----------------------------- delete allowance structure  --------------------------------// end
//#endregion



/////////////////---------------- employee's allowance -----------------------/////////////////////
//#region 

//----------------------------- create employee's allowance --------------------------------// begin
//#region 
async function createEmployeeallowance(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_allowance";
    const tblname_empall = 'tblempAllowance';
    const tblname_employee = 'tblemployee';
    const collref_allowance = db.collection(tblname_ref);
    const colltblempallowance = db.collection(tblname_empall);
    const colltblemployee = db.collection(tblname_employee);

    const getlistref_allowance = await collref_allowance.distinct("allowanceId",{IsFix: false});
    const validateSchema = {...validateSupport(tblname_empall,getlistref_allowance)};
    // try {
    //     await db.createCollection(tblname_empall,{
    //         validator: validateSchema
    //     });
    // } catch (error) {
    //     //console.log(error);
    //     await db.command({
    //         collMod: tblname_empall,
    //         validator: validateSchema
    //     })
    // };
    
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;

    const listEmployeeIdInDB = await colltblemployee.find().project({employeeId:1}).toArray();
    const getListEmpallowance = await colltblempallowance.find({}).project({_id: 0, employeeId: 1, dateChange: 1}).toArray();

    let listDataForInsert = dataClient.filter((ele) => ([...getListEmpallowance].some(
        eleInner => eleInner.employeeId === ele.employeeId && functionSupport.castDate(eleInner.dateChange,1) === functionSupport.castDate(ele.dateChange,1)
        ) === true)? false : true);
  
    listDataForInsert = (listDataForInsert.filter(ele => (listEmployeeIdInDB.map(eleInner => eleInner.employeeId)).includes(ele.employeeId))).
    filter(eleInner => getlistref_allowance.includes(eleInner.allowanceId));
   
    if(listDataForInsert.length === 0) return status(0,0);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            employeeId: current.employeeId,
            dateChange: functionSupport.castDate(current.dateChange,0),
            allowanceId: current.allowanceId,
            amount: new Double(current.amount),
            note: current.note
        })
        return value;
    },[]);
    console.log(dataForInsert); 
    const listEmployeeallowance = await colltblempallowance.insertMany(dataForInsert);
    return listEmployeeallowance;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- create employee's allowance --------------------------------// end

//----------------------------- update employee's allowance --------------------------------// begin
//#region 
async function updateEmployeeallowance(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_allowance";
    const tblname_empall = 'tblempAllowance';
    const tblname_employee = 'tblemployee';
    const collref_allowance = db.collection(tblname_ref);
    const colltblempallowance = db.collection(tblname_empall);
    const colltblemployee = db.collection(tblname_employee);
    
    try {
    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
    // get list ref allowance
    const getlistref_allowance = await collref_allowance.distinct("allowanceId",{IsFix: false});
    // get list employee allowance
    const getListEmpallowance = await colltblempallowance.find({}).project({_id: 1, employeeId: 1, dateChange: 1, allowanceId: 1}).toArray();
    // get list emloyeeId in DB
    const listEmployeeIdInDB = await colltblemployee.find().project({employeeId:1}).toArray();
    // check valid employeeid from tblemployee
    let listDataForInsert = dataClient.filter(ele => ([...listEmployeeIdInDB].map(eleInner => eleInner.employeeId)).includes(ele.employeeId));
    // check valid duplicate data (employeeId, dateChange)
    listDataForInsert = listDataForInsert.filter((ele) => ([...getListEmpallowance].some(
        eleInner => eleInner.employeeId === ele.employeeId && 
        functionSupport.castDate(eleInner.dateChange,1) === functionSupport.castDate(ele.dateChange,1) &&
        eleInner.allowanceId === ele.allowanceId &&
        Number(eleInner.amount) === Number(ele.amount)
        ) === true)? false : true);
    // check valid empallowanceId
    listDataForInsert = listDataForInsert.filter(ele => getlistref_allowance.includes(ele.allowanceId));
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
            allowanceId: current.allowanceId,
            amount: new Double(current.amount),
            note: current.note
        }
        };
    const respone = await colltblempallowance.updateOne(filter,listDataUpdate);
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
//----------------------------- update employee's allowance --------------------------------// end

//----------------------------- delete employee's allowance --------------------------------// begin
//#region 
async function deleteEmployeeallowance(body)
{
    const connect = await mongodb.connect(connectString);
    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    for(let ele of dataClient)
    {
        const dataForDelete = {
            _id: new objectIdmg(ele._id)
        }
        const respone = await connect.db(dbName).collection('tblempAllowance').deleteOne(dataForDelete);
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
//----------------------------- delete employee's allowance  --------------------------------// end


//#endregion


module.exports = {
    //--------------allowance structure---------------//
    createallowanceStruct: createallowanceStruct,
    updateallowanceStruct: updateallowanceStruct,
    deleteallowanceStruct: deleteallowanceStruct,

    //--------------employee's allowance--------------//
    createEmployeeallowance: createEmployeeallowance,
    updateEmployeeallowance: updateEmployeeallowance,
    deleteEmployeeallowance: deleteEmployeeallowance
};