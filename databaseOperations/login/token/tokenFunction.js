const connectString = require('../../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../../other/supportFunction');
const status = require("../../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../../other/supportValidateSchema');
const momentJS = require('moment');
const dbName = "humanproject";
const jwt = require('jsonwebtoken');
require('dotenv').config();


// create token

function createToken(payload,opt,timeExpr)
{
    try {
    let token = undefined;
    // opt = 0 (access token)
    // opt = 1 (refresh token)
    switch(opt)
    {
        case 0:
            token = jwt.sign(payload,process.env.ACCESS_TOKEN,{
                expiresIn: String(timeExpr)
            });
        break;
        case 1:
            token = jwt.sign(payload,process.env.REFRESH_TOKEN,{
                expiresIn: String(timeExpr)
            });
        break;
    }
    return token;
    } catch (error) {
        console.log(error);
        throw error
    }
};

// auth token

function authToken(req,res,next)
{
    try {
        const access_token = req.query.access_token || req.body.access_token || req.headers["access-token"],
              refresh_token = req.query.refresh_token || req.body.refresh_token || req.headers["refresh-token"];
        if(!access_token || !refresh_token) throw new Error('Please provide token');
        const checkvalid_access = jwt.verify(access_token,process.env.ACCESS_TOKEN),
              checkvalid_refresh = jwt.verify(refresh_token,process.env.REFRESH_TOKEN);
        if(!checkvalid_access || !checkvalid_refresh) throw new Error('verify error!');
        //res.data = checkvalid_access;
        next();
        } catch (error) {
            console.log(error);
            throw error;
        }
}

// update token

function updateToken(oldAToken,RToken,timeExpr)
{
    try {
        if(!oldAToken || !RToken) throw new Error(`please provide token!`);
        const checkvalid_refresh = jwt.verify(RToken,process.env.REFRESH_TOKEN),
              checkvalid_access = jwt.verify(oldAToken,process.env.ACCESS_TOKEN,{
                    ignoreExpiration: true
              });
        if(!checkvalid_refresh || !checkvalid_access) throw new Error(`verify token error!`);
        const payload = {
            accountId: checkvalid_refresh.accountId,
            accountName: checkvalid_refresh.accountName,
            email: checkvalid_refresh.email
        };
        const newToken = createToken(payload,0,timeExpr);
        if(!newToken) throw new Error(`sign token error!`) 
        return newToken;
        } catch (error) {
            console.log(error);
            throw error
        }
}


module.exports = {
    createToken: createToken,
    authToken: authToken,
    updateToken: updateToken
};