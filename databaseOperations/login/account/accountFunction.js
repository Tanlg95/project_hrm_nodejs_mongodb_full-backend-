const connectString = require('../../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../../other/supportFunction');
const status = require("../../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../../other/supportValidateSchema');
const momentJS = require('moment');
const dbName = "humanproject";
const bcrypt = require('bcrypt');
const statusLogin = require('../../../other/supportStatus').statusLogin;

// // login

// async function login(body)
// {
//     const connect = await mongodb.connect(connectString);
//     const db = connect.db(dbName);
//     const tblaccount = 'tblaccount';
//     const collAccount = db.collection(tblaccount);
//     try {
//     const account = body;
//     // check exists account
//     const checkExistsAccount = await collAccount.find({accountId: account.accountId}).project({_id: 0}).toArray();
//     if(checkExistsAccount.length === 0) throw statusLogin(0).message;
//     const checkExistsAccountNew = ([...checkExistsAccount])[0];
//     // check valid password
//     const passwordEncrypt =  checkExistsAccountNew.pwd;
//     const passwordCompare = bcrypt.compare(account.pwd,passwordEncrypt);
//     if(!passwordCompare) throw statusLogin(1).message;

//     // return account's information
//     return statusLogin(2,{
//         accountId: checkExistsAccountNew.accountId,
//         accountName: checkExistsAccountNew.accountName,
//         email: checkExistsAccountNew.email,
//         atoken: checkExistsAccountNew.atoken
//     });
//     } catch (error) {
//     console.log(error);
//     throw error;
//     } finally {
//     await connect.close();
//     }
// };


// login

async function login(accountId)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblaccount = 'tblaccount';
    const collAccount = db.collection(tblaccount);
    try {
    // check exists account
    const checkExistsAccount = await collAccount.find({accountId: accountId}).project({_id: 0}).toArray();
    if(checkExistsAccount.length === 0) throw statusLogin(0).message;
    const checkExistsAccountNew = ([...checkExistsAccount])[0];
    // return account's information
    return statusLogin(2,{
        accountId: checkExistsAccountNew.accountId,
        accountName: checkExistsAccountNew.accountName,
        email: checkExistsAccountNew.email,
        atoken: checkExistsAccountNew.atoken
    });
    } catch (error) {
    console.log(error);
    throw error;
    } finally {
    await connect.close();
    }
};

module.exports = {
    login: login
}