const connectString = require('../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../other/supportFunction');
const statusF = require("../other/supportStatus").statusCollection;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../other/supportValidateSchema');
const momentJS = require('moment');
const dbName = "humanproject";
const statusRequest = require('../other/supportStatus').statusRequest;

/* ------------------------------------- tblemployee --------------------------------- */

async function createStuctEmployee()
{
    const tblname = 'tblemployee';
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
        // return status
        let status = 0;
        // check exists collection
        const checkExistsColl = await db.listCollections({name:"tblemployee"}).toArray();
        // create collection 
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                })
            }
        
        // create index
        await db.collection(tblname).createIndex({employeeId: 1},{name:"idx_tblemployee", unique: true});    
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};

/* ------------------------------------- position --------------------------------- */

async function createStuctPos()
{
    const tblname_ref = 'tblref_position'
    const tblname = 'tblemppos';
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:{$in:[tblname, tblname_ref]}}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
                await db.createCollection(tblname_ref,{
                    validator: {...validateSupport(tblname_ref,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                });
                await db.command({
                    collMod: tblname_ref,
                    validator: {...validateSupport(tblname_ref,null)}
                });
            }
        
        // create index

        await db.collection(tblname_ref).createIndex({posId:1});
        await db.collection(tblname).createIndex({employeeId: 1, dateChange: -1, posId: 1},{name:"idx_tblemppos", unique: true});
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};

/* ------------------------------------- department --------------------------------- */

async function createStuctDep()
{
    const tblname_ref = 'tblref_department'
    const tblname = 'tblempdep';
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:{$in:[tblname, tblname_ref]}}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
                await db.createCollection(tblname_ref,{
                    validator: {...validateSupport(tblname_ref,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                });
                await db.command({
                    collMod: tblname_ref,
                    validator: {...validateSupport(tblname_ref,null)}
                });
            }
        
        await db.collection(tblname_ref).createIndexes([{key:{depId: 1}, name: "idx_tblref_department_depId"}]);
        await db.collection(tblname).createIndexes([{ key: {employeeId: 1, dateChange: -1}, name: "idx_employeeId_dateChange"},{key:{dateChange: -1},name:"idx_dateChange"}]);
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};

/* ------------------------------------- employee's type --------------------------------- */

async function createStuctEmpType()
{
    const tblname_ref = 'tblref_empType'
    const tblname = 'tblempType';
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:{$in:[tblname, tblname_ref]}}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
                await db.createCollection(tblname_ref,{
                    validator: {...validateSupport(tblname_ref,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                });
                await db.command({
                    collMod: tblname_ref,
                    validator: {...validateSupport(tblname_ref,null)}
                });
            }
        // create index
        await db.collection(tblname_ref).createIndexes([{key:{empTypeId:1},name:"idx_emptype_empTypeId"}]);
        await db.collection(tblname).createIndexes([{key:{employeeId:1,dateChange:-1,empTypeId: 1},name:"idx_empType_employeeId_dateChange_empTypeId"}]);
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};

/* ------------------------------------- contraction --------------------------------- */

async function createStuctEmpContract()
{
    const tblname_ref = 'tblref_contractType'
    const tblname = 'tblempContract';
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:{$in:[tblname, tblname_ref]}}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
                await db.createCollection(tblname_ref,{
                    validator: {...validateSupport(tblname_ref,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                });
                await db.command({
                    collMod: tblname_ref,
                    validator: {...validateSupport(tblname_ref,null)}
                });
            }
        // create index
        await db.collection(tblname_ref).createIndexes([{key:{contractTypeId:1},name:"idx_contract_contractTypeId"}]);
        await db.collection(tblname).createIndexes([{key:{employeeId:1,dateChange:-1,contractTypeId: 1},name:"idx_empcontract_employeeId_dateChange_contractTypeId"}]);
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};

/* ------------------------------------- Allowance --------------------------------- */

async function createStuctEmpAllowance()
{
    const tblname_ref = 'tblref_allowance'
    const tblname = 'tblempAllowance';
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:{$in:[tblname, tblname_ref]}}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
                await db.createCollection(tblname_ref,{
                    validator: {...validateSupport(tblname_ref,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                });
                await db.command({
                    collMod: tblname_ref,
                    validator: {...validateSupport(tblname_ref,null)}
                });
            }

        // create index

        await db.collection(tblname_ref).createIndexes([{key:{allowanceId:1},name:"idx_refempallowance_allowanceId"}]);
        await db.collection(tblname).createIndexes([{key:{employeeId:1,dateChange:-1, allowanceId: 1},name:"idx_empallowance_employeeId_dateChange_allowanceId"}]);    
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};


/* ------------------------------------- Allowance fix --------------------------------- */

async function createStuctEmpAllowanceFix()
{
    const tblname_ref = 'tblref_allowance'
    const tblname = 'tblempAllowanceFix';
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:{$in:[tblname, tblname_ref]}}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
                await db.createCollection(tblname_ref,{
                    validator: {...validateSupport(tblname_ref,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                });
                await db.command({
                    collMod: tblname_ref,
                    validator: {...validateSupport(tblname_ref,null)}
                });
            }

        // create index

        await db.collection(tblname_ref).createIndexes([{key:{allowanceId:1},name:"idx_refempallowance_allowanceId"}]);
        await db.collection(tblname).createIndexes([{key:{employeeId:1,dateChange:-1, allowanceId: 1},name:"idx_empallowanceFix_employeeId_dateChange_allowanceId"}]);
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};



/* ------------------------------------- add/deduct --------------------------------- */

async function createStuctEmpAD()
{
    const tblname_ref = 'tblref_addDeduct'
    const tblname = 'tblempAddDeduct';
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:{$in:[tblname, tblname_ref]}}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
                await db.createCollection(tblname_ref,{
                    validator: {...validateSupport(tblname_ref,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                });
                await db.command({
                    collMod: tblname_ref,
                    validator: {...validateSupport(tblname_ref,null)}
                });
            }

        // create index
        await db.collection(tblname_ref).createIndexes([{key:{addDeductId:1},name:"idx_refempAddDeduct_addDeductId"}]);
        await db.collection(tblname).createIndexes([{key:{employeeId:1,dateChange:-1, addDeductId: 1},name:"idx_empAddDeduct_employeeId_dateChange_addDeductId"}]);
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};


/* ------------------------------------- basic salary --------------------------------- */

async function createStuctEmpSal()
{
    const tblname = 'tblempAddDeduct';
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:tblname}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                });
            }
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};


/* ------------------------------------- payroll --------------------------------- */

async function createStuctPayroll()
{
    const tblname = 'tblpayroll';
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:tblname}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                });
            }
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};


/* ------------------------------------- parameter --------------------------------- */

async function createStuctPara()
{
    const tblname_ref = 'tblref_payrollParameter'
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:tblname_ref}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname_ref,{
                    validator: {...validateSupport(tblname_ref,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname_ref,
                    validator: {...validateSupport(tblname_ref,null)}
                });
            }
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};

/* ------------------------------------- account --------------------------------- */

async function createStuctAccount()
{
    const tblname = 'tblaccount'
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:tblname}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                });
            }
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};


/* ------------------------------------- family dependent --------------------------------- */

async function createStuctFamily()
{
    const tblname_ref = 'tblref_relation'
    const tblname = 'tblempFamilyDepen';
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:{$in:[tblname, tblname_ref]}}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
                await db.createCollection(tblname_ref,{
                    validator: {...validateSupport(tblname_ref,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                });
                await db.command({
                    collMod: tblname_ref,
                    validator: {...validateSupport(tblname_ref,null)}
                });
            }
        // create index
        await db.collection(tblname_ref).createIndexes([{key:{relateId:1},name:"idx_ref_relation_relateId"}]);
        await db.collection(tblname).createIndexes([{key:{employeeId:1,perDepenIDcard: 1, fromdate: -1},name:"idx_familyDepen_employeeId_perDepenIDcard_relateId"}]);
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};


/* ------------------------------------- roles --------------------------------- */

async function createStuctRole()
{
    const tblname = 'tblref_roles'
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:tblname}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                });
            }
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};

/* ------------------------------------- total work days --------------------------------- */

async function createStuctWD()
{
    const tblname = 'tbltotalWD'
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
         // return status
         let status = 0;
         // check exists collection 
        const checkExistsColl = await db.listCollections({name:tblname}).toArray();
        // create collection
        if(checkExistsColl.length === 0)
            {
                await db.createCollection(tblname,{
                    validator: {...validateSupport(tblname,null)}
                });
            } else {
                status = 1;
                await db.command({
                    collMod: tblname,
                    validator: {...validateSupport(tblname,null)}
                });
            }
        return (status === 0) ? statusF(0) : statusF(1);
    } catch (error) {
        console.log(error);
        throw error;
    } finally
    {
        await connect.close();
    }
};

module.exports = {
    createStuctEmployee: createStuctEmployee,
    createStuctPos: createStuctPos,
    createStuctDep: createStuctDep,
    createStuctEmpType: createStuctEmpType,
    createStuctEmpContract: createStuctEmpContract,
    createStuctEmpAllowance: createStuctEmpAllowance,
    createStuctEmpAllowanceFix: createStuctEmpAllowanceFix,
    createStuctEmpAD: createStuctEmpAD,
    createStuctEmpSal: createStuctEmpSal,
    createStuctPayroll: createStuctPayroll,
    createStuctPara: createStuctPara,
    createStuctAccount: createStuctAccount,
    createStuctFamily: createStuctFamily,
    createStuctRole: createStuctRole,
    createStuctWD: createStuctWD,


}