const connectString = require('../../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../../other/supportFunction');
const status = require("../../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../../other/supportValidateSchema');
const momentJS = require('moment');
const dbName = "humanproject";
const encrypt = require('bcrypt');
const createToken = require('../token/tokenFunction').createToken;
const updateToken = require('../token/tokenFunction').updateToken;
const statusRequest = require('../../../other/supportStatus').statusRequest;

// register account

async function registerAccount(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblaccount = 'tblaccount';
    const collAccount = db.collection(tblaccount);

    const validateSchema = {...validateSupport(tblaccount,null)};
    try {
    await db.createCollection(tblaccount,{
        validator: validateSchema
    });
    } catch (error) {
    await db.command({
        collMod: tblaccount,
        validator: validateSchema
    });
    }
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    const checkExistsAccount = await collAccount.distinct("accountId");
    let dataClientFilter = [...dataClient].filter(ele => (checkExistsAccount.includes(ele.accountId))? false : true);
    if(dataClientFilter.length === 0) return status(0,0);

    dataClientFilter =  dataClientFilter.map(ele =>{
        // check valid password
        const validPass = (validPassword(ele.pwd))? ele.pwd : "defaultPass@123";
        // encrypt password
        const passwordEncrypt = encrypt.hashSync(validPass,encrypt.genSaltSync(10));
        // create payload use for creating token
        const payload = {
            accountId: ele.accountId,
            accountName: ele.accountName,
            email: ele.email,
            permis: 0 // this feature will be available soon
        }
        const account = {
            accountId: ele.accountId,
            accountName: ele.accountName,
            email: (validEmail(ele.email))? ele.email : "dummy@dumb.com",
            pwd: passwordEncrypt,
            atoken: createToken(payload,0,"30d"),
            rtoken: createToken(payload,1,"120d"),
            note: ele.note
        }
        return account;
    });
    const respone = await collAccount.insertMany(dataClientFilter);
    return respone;
    } catch (error) {
    console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
};

// update account's information 
async function updateAccount(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblaccount = 'tblaccount';
    const collAccount = db.collection(tblaccount);
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    const checkExistsAccount = await collAccount.distinct('accountId');
    // check exists token
    let dataClientFilter = [...dataClient].filter(ele => checkExistsAccount.includes(ele.accountId));
    let totalRowsAffect = 0;
    if(dataClientFilter.length === 0) return status(totalRowsAffect,1);
    for(let ele of dataClientFilter)
    {
        // valid emal
        const Email = (validEmail(ele.email))? ele.email : null;
        if(Email === null) return status(0,1);
        const account = {
            $set:{
                accountName: ele.accountName,
                email: Email
            }
        };
        const respone = await collAccount.updateOne({accountId: ele.accountId},account);
        totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;
    }
    return status(totalRowsAffect,1);
    } catch (error) {
    console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}


// delete account 
async function deleteAccount(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblaccount = 'tblaccount';
    const collAccount = db.collection(tblaccount);
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    let totalRowsAffect = 0;
    if(dataClient.length === 0) return status(totalRowsAffect,2);
    for(let ele of dataClient)
    {
        const account = {accountId: ele.accountId};
        const respone = await collAccount.deleteOne(account);
        totalRowsAffect += (respone.deletedCount === 1)? 1 : 0;
    }

    return status(totalRowsAffect,2);
    } catch (error) {
    console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}

// update accesstoken 

async function updateAccessToken(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblaccount = 'tblaccount';
    const collAccount = db.collection(tblaccount);
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message; 
    const checkExistsAccount = await collAccount.distinct('accountId');
    // check exists account
    let dataClientFilter = [...dataClient].filter(ele => checkExistsAccount.includes(ele.accountId));
    let totalRowsAffect = 0;
    if(dataClientFilter.length === 0) return status(totalRowsAffect,1);
    for(let ele of dataClientFilter)
    {
        // update access token
        const newtoken = updateToken(ele.atoken,ele.rtoken,"30d");
        if(!newtoken) return status(totalRowsAffect,1); 
        const account = {
            $set:{
                atoken: newtoken
            }
        };
        const respone = await collAccount.updateOne({accountId: ele.accountId},account);
        totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;
    }   
    return status(totalRowsAffect,1);
    } catch (error) {
    console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}

// update password 

async function updatePassword(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblaccount = 'tblaccount';
    const collAccount = db.collection(tblaccount);
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    const checkExistsAccount = await collAccount.find({}).project({_id: 0, accountId: 1, pwd: 1}).toArray();
    // check exists account 
    let dataClientFilter = [...dataClient].filter(ele => ([...checkExistsAccount].map(eleInner => eleInner.accountId)).includes(ele.accountId));
    let totalRowsAffect = 0;
    if(dataClientFilter.length === 0) return status(totalRowsAffect,1);
    for(let ele of dataClientFilter)
    {   // check valid old password 
        const validOldPass = encrypt.compareSync(ele.pwdOld, ele.pwd);
        if(!validOldPass) throw new Error(`old password is not correct! please check again!`);
        // check valid password
        const validPass = (validPassword(ele.pwdNew))? ele.pwdNew : "defaultPass@123";
        // encrypt password
        const passwordEncrypt = encrypt.hashSync(validPass,encrypt.genSaltSync(10));
        if(!passwordEncrypt) return status(totalRowsAffect,1); 
        const account = {
            $set:{
                pwd: passwordEncrypt
            }
        };
        const respone = await collAccount.updateOne({accountId: ele.accountId},account);
        totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;
    }   
    return status(totalRowsAffect,1);
    } catch (error) {
    console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}

// check valid email
function validEmail(email)
{
    const match = /[a-z][a-z0-9._-]*@[a-z][a-z0-9_-]+\.[a-z]+(?:\.[a-z]+)?/i;
    const checkMatch = email.match(match);
    if(checkMatch === null) return false;
    const validEmail = (checkMatch[0] === email)? true: false;
    return validEmail;
}

// check valid password
function validPassword(pwd)
{
    // Password policy
    /*
        minimum length: 10
        maximun length: 30
        At least 1 upper character
        At least 1 lower character
        At least 1 special character: @!#$%&
        At least 1 digital character
    */
    if(pwd.length < 10 || pwd.length > 30) return false;
    const match = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@!#$%&])(?!.*[^a-zA-Z0-9@!#$%&])/;
    const checkMatch = pwd.match(match);
    if(checkMatch === null) return false;
    return true;
}

module.exports = {
    // account operations
    registerAccount: registerAccount,
    updateAccount: updateAccount,
    deleteAccount: deleteAccount,
    updatePassword: updatePassword,

    // token operations
    updateAccessToken: updateAccessToken,

};