const mongodb = require('mongodb').MongoClient;
const connectString = require('../databaseConnections/mongoDbConnection');

function castDate(val,opt)
{   
    let newDate = undefined;
    switch (opt) {
        case 0:
            newDate = new Date(val);
            break;
        case 1:
            newDate = new Date(val).valueOf();
            break;
        case 2:
            newDate = new Date(val).toISOString().split('T')[0];
            break;
        default:
            break;
    }
    return newDate;
}

function checkNullValueTrim(val){
    return (val === null) ? null : String(val).trim();
}
function checkNullValueTrimMysql(val){
    return (val === null || val === undefined) ? null : `'`.concat(String(val).trim(),`'`);
}
function castStringNumber(val)
{
    let listarr = ['0','1','2','3','4','5','6','7','8','9'];
    for(let i = 0; i < val.length; ++i)
    {
        if( listarr.includes(val[i + 1]) === true)
        {
            return Number(val.substring(i + 1, val.length));
        }
    }
    return val; 
}


module.exports = {
    castDate: castDate,
    checkNullValueTrim: checkNullValueTrim,
    checkNullValueTrimMysql: checkNullValueTrimMysql,
    castStringNumber: castStringNumber
}