const connectString = require('../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../other/supportFunction');
const status = require("../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../other/supportValidateSchema');
const momentJS = require('moment');
const dbName = "humanproject";

/////////////////---------------- contraction structure -----------------------/////////////////////
//#region 

//----------------------------- create contraction structure --------------------------------// begin
//#region 
async function createcontractionStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = "tblref_contractType";
    const tblname_emp = 'tblempContract';
    const collref_contraction = db.collection(tblname_ref);
    const colltblempcontract = db.collection(tblname_emp);
    // check data if exists
    const checkExists = await collref_contraction.find({}).project({_id:0,contractTypeId: 1}).toArray();
    //const checkExistsEmppos = await colltblemppos.find({}).project({_id:0,posId:1}).toArray();
    const checkExistsMap = [...checkExists].map(ele => ele.contractTypeId);
    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    let listDataForInsert = dataClient.filter((ele) => (checkExistsMap.includes(ele.contractTypeId))? false : true);
    
    const listDataForvalidateEmpContract = ([...listDataForInsert].map(ele => ele.contractTypeId)).concat(checkExistsMap);
    //console.log(listDataForvalidateEmpContract);
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
            validator: {...validateSupport(tblname_emp,listDataForvalidateEmpContract)}
        });
    } catch (error) {
        await db.command({
            collMod: tblname_emp,
            validator: {...validateSupport(tblname_emp,listDataForvalidateEmpContract)}
        })
    }
    await collref_contraction.createIndexes([{key:{contractTypeId:1},name:"idx_contract_contractTypeId"}]);
    await colltblempcontract.createIndexes([{key:{employeeId:1,dateChange:-1,contractTypeId: 1},name:"idx_empcontract_employeeId_dateChange_contractTypeId"}]);
    
    try {
   
    if(listDataForInsert.length === 0) return status(0,0);
    //console.log(listDataForInsert);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            contractTypeId: current.contractTypeId,
            contractTypeName: current.contractTypeName,
            month: Number(current.month),
            note: current.note
        })
        return value;
    },[]);
    const listcontractionStructure = await collref_contraction.insertMany(dataForInsert);
    return listcontractionStructure;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- create contraction structure --------------------------------// end

//----------------------------- update contraction structure --------------------------------// begin
//#region 
async function updatecontractionStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = 'tblref_contractType';
    const tblname_emp = 'tblempContract';
    const collref_contraction = db.collection(tblname_ref);
    const colltblempcontract = db.collection(tblname_emp);
    const getListref_contract= await collref_contraction.find({}).project({_id: 0, contractTypeId: 1}).toArray();
    const getListEmpContract = await colltblempcontract.find({}).project({_id:0, contractTypeId: 1}).toArray();
    const getListEmpContractMap = [...getListEmpContract].map(ele => ele.contractTypeId);
   
    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;    
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    // can not update document which's using by employee(becuz month caculation will not be right)
    let dataClientFilter = [...dataClient].filter(ele => getListEmpContractMap.includes(ele.contractTypeId)? false: true);
    dataClientFilter = dataClientFilter.filter(ele => ([...getListref_contract].map(eleInner => eleInner.contractTypeId)).includes(ele.contractTypeId));
    //const dataClientFilteUpdateAll = [...dataClient].filter(ele => ([...dataClientFilter].map(eleInner => eleInner.posId)).includes(ele.posId)? false: true);
    //console.log(dataClientFilter);
    for(let current of dataClientFilter)
    {
     const filter = {'contractTypeId' : current.contractTypeId};
     const listDataUpdate = 
        {   
        $set:{
            contractTypeName: current.contractTypeName,
            month: Number(current.month), 
            note: current.note
        }
        };
    //console.log(listDataUpdate);
    const respone = await collref_contraction.updateOne(filter,listDataUpdate);
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
    // const respone = await collref_contraction.updateOne(filter,listDataUpdate);
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
//----------------------------- update contraction structure --------------------------------// end

//----------------------------- delete contraction structure --------------------------------// begin
//#region 
async function deletecontractionStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = 'tblref_contractType';
    const tblname_emp = 'tblempContract';
    const collref_contraction = db.collection(tblname_ref);
    const colltblempcontract = db.collection(tblname_emp);
    const getListref_contract= await collref_contraction.find({}).project({_id: 0, contractTypeId: 1}).toArray();
    const getListEmpContract = await colltblempcontract.find({}).project({_id:0, contractTypeId: 1}).toArray();
    const getListEmpContractMap = [...getListEmpContract].map(ele => ele.contractTypeId);

    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;    
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    let dataClientFilter = [...dataClient].filter(ele => getListEmpContractMap.includes(ele.contractTypeId)? false: true );
    dataClientFilter = dataClientFilter.filter(ele => ([...getListref_contract].map(eleInner => eleInner.contractTypeId)).includes(ele.contractTypeId));

    const validateSchemaref_contractListType = ([...getListref_contract].map(ele => ele.contractTypeId)).
    filter(eleInner => ([...dataClientFilter].map(eleInner2 => eleInner2.contractTypeId)).includes(eleInner)? false : true);

    const validateSchema = {...validateSupport(tblname_emp,validateSchemaref_contractListType)};
    await db.command({
        collMod: tblname_emp,
        validator: validateSchema
    });

    if(dataClientFilter.length === 0) return status(0,2);
    for(let ele of dataClientFilter)
    {
        const dataForDelete = {
            contractTypeId: ele.contractTypeId
        }
        const respone = await collref_contraction.deleteOne(dataForDelete);
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
//----------------------------- delete contraction structure  --------------------------------// end
//#endregion



/////////////////---------------- employee's contraction -----------------------/////////////////////
//#region 

//----------------------------- create employee's contraction --------------------------------// begin
//#region 
async function createEmployeecontraction(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = 'tblref_contractType';
    const tblname_emp = 'tblempContract';
    const tblname_employee = 'tblemployee';
    const collref_contraction = db.collection(tblname_ref);
    const colltblempcontract = db.collection(tblname_emp);
    const colltblemployee = db.collection(tblname_employee);
    const getListref_contract= await collref_contraction.find({}).project({_id: 0, contractTypeId: 1}).toArray();
    const getListEmpContract = await colltblempcontract.find({}).project({_id:0, employeeId: 1, fromdate: 1}).toArray();
    const getListref_contractMap = [...getListref_contract].map(ele => ele.contractTypeId);

    const validateSchema = {...validateSupport(tblname_emp,getListref_contractMap)};
    try {
        await db.createCollection(tblname_emp,{
            validator: validateSchema
        });
    } catch (error) {
        //console.log(error);
        db.command({
            collMod: tblname_emp,
            validator: validateSchema
        })
    };
    
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw new Error(`data must be an array!!!!`);

    const listEmployeeIdInDB = await colltblemployee.find().project({employeeId:1}).toArray();
    let listDataForInsert = dataClient.filter((ele) => ([...getListEmpContract].some(
        eleInner => eleInner.employeeId === ele.employeeId && functionSupport.castDate(eleInner.fromdate,1) === functionSupport.castDate(ele.fromdate,1)
        ) === true)? false : true);
  
    listDataForInsert = (listDataForInsert.filter(ele => (listEmployeeIdInDB.map(eleInner => eleInner.employeeId)).includes(ele.employeeId))).
    filter(eleInner => getListref_contractMap.includes(eleInner.contractTypeId));
   
    if(listDataForInsert.length === 0) return status(0,0);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
        value.push({
            employeeId: current.employeeId,
            fromdate: functionSupport.castDate(current.fromdate,0),
            todate: (current.todate === null)? null : functionSupport.castDate(current.todate,0),
            contractTypeId: current.contractTypeId,
            note: current.note
        })
        return value;
    },[]);
    const listEmployeecontraction = await colltblempcontract.insertMany(dataForInsert);
    return listEmployeecontraction;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- create employee's contraction --------------------------------// end

//----------------------------- update employee's contraction --------------------------------// begin
//#region 
async function updateEmployeecontraction(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_ref = 'tblref_contractType';
    const tblname_emp = 'tblempContract';
    const tblname_employee = 'tblemployee';
    const collref_contraction = db.collection(tblname_ref);
    const colltblempcontract = db.collection(tblname_emp);
    const colltblemployee = db.collection(tblname_employee);
    const getListref_contract= await collref_contraction.find({}).project({_id: 0, contractTypeId: 1, month: 1}).toArray();
    const getListEmpContract = await colltblempcontract.find({}).project({_id:0, employeeId: 1, fromdate: 1, contractTypeId: 1}).toArray();
    

    try {
    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    
    const listEmployeeIdInDB = await colltblemployee.find().project({employeeId:1}).toArray();
    // check valid employeeid from tblemployee
    let listDataForInsert = dataClient.filter(ele => ([...listEmployeeIdInDB].map(eleInner => eleInner.employeeId)).includes(ele.employeeId));
    // check valid fromdate and todate 
    listDataForInsert = listDataForInsert.filter(ele => {
        const getConntractType = ((getListref_contract.filter(eleInner => eleInner.contractTypeId === ele.contractTypeId)).length === 0)? 0 : 
        (getListref_contract.filter(eleInner => eleInner.contractTypeId === ele.contractTypeId))[0].month;
        const month = Number(getConntractType);
        const todateCorrect = momentJS(ele.fromdate,'YYYYMMDD').add(month,'months').valueOf();
        if( ( momentJS(ele.todate,'YYYYMMDD').valueOf() === todateCorrect && month !== 0) || (ele.contractTypeId === 'HDKXD' && ele.todate === null))
        return ele;
        return false;
    });
    // check valid duplicate data (employeeId, fromdate, contractTypeId)
    listDataForInsert = listDataForInsert.filter((ele) => ([...getListEmpContract].some(
        eleInner => eleInner.employeeId === ele.employeeId && 
        functionSupport.castDate(eleInner.fromdate,1) === functionSupport.castDate(ele.fromdate,1) &&
        eleInner.contractTypeId === ele.contractTypeId
        ) === true)? false : true);
    
    //console.log(listDataForInsert);
    let totalRowsAffect = 0;    
    for(let current of listDataForInsert)
    {
     const filter = {'_id' : new objectIdmg(current._id)};
     const listDataUpdate = 
        {   
        $set:{
            employeeId: current.employeeId,
            fromdate: functionSupport.castDate(current.fromdate,0),
            todate: (current.todate === null) ? null : functionSupport.castDate(current.todate,0),
            contractTypeId: current.contractTypeId,
            note: current.note
        }
        };
    const respone = await colltblempcontract.updateOne(filter,listDataUpdate);
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
//----------------------------- update employee's contraction --------------------------------// end

//----------------------------- delete employee's contraction --------------------------------// begin
//#region 
async function deleteEmployeecontraction(body)
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
        const respone = await connect.db(dbName).collection('tblempContract').deleteOne(dataForDelete);
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
//----------------------------- delete employee's contraction  --------------------------------// end


//#endregion


module.exports = {
    //--------------contraction structure---------------//
    createcontractionStruct: createcontractionStruct,
    updatecontractionStruct: updatecontractionStruct,
    deletecontractionStruct: deletecontractionStruct,

    //--------------employee's contraction--------------//
    createEmployeecontraction: createEmployeecontraction,
    updateEmployeecontraction: updateEmployeecontraction,
    deleteEmployeecontraction: deleteEmployeecontraction
};