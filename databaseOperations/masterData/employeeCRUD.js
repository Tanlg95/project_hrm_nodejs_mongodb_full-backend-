const connectString = require('../../databaseConnections/mongoDbConnection');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../other/supportFunction');
const status = require("../../other/supportStatus").status;
const validateSupport = require('../../other/supportValidateSchema');
const dbName = 'humanproject';
const statusRequest = require('../../other/supportStatus').statusRequest;

//----------------------------- get employee information--------------------------------// begin
//#region 
async function getemployee(empid)
{
    const connect = await mongodb.connect(connectString);
    try {
    // * => get all employee
    const filter = (String(empid).trim(' ') === '*')? {}: {employeeId:String(empid).toUpperCase()};
    console.log(filter);
    const listemployee = await connect.db('humanproject').collection('tblemployee').find(filter).toArray();
    return listemployee;
    } catch (error) {
        // console.log(error);
        throw error;
    } finally{  
        connect.close();
    }
}
//#endregion
//----------------------------- get employee information --------------------------------// end

//----------------------------- create employee--------------------------------// begin
//#region 
async function createEmployee(body)
{
    const connect = await mongodb.connect(connectString);
    const tblname_employee = 'tblemployee';
    const db = connect.db(dbName);

    const validateSchema = {...validateSupport(tblname_employee,null)};
    // try {
    // await db.createCollection(tblname_employee,{
    //     validator: validateSchema
    // });
    // } catch (error) {
    // await db.command({
    //     collMod: tblname_employee,
    //     validator: validateSchema
    // });  
    // }
    try {
    const dataClient = body.body;    
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    // check data if exists
    const collEmployee = db.collection(tblname_employee);
    const checkExists = await collEmployee.find({}).toArray();
    let listDateForInsert = dataClient.filter((ele) => (checkExists.findIndex(eleInner => eleInner.employeeId === ele.employeeId) === -1)? true : false);
    if(listDateForInsert.length === 0) return status(0,0);
    const dataForInsert = listDateForInsert.reduce((value,current) => {
        value.push({
            'employeeId':  current.employeeId,
            'employeeName': current.employeeName,
            'birthDate': functionSupport.castDate(current.birthDate,0),
            'employedDate': functionSupport.castDate(current.employedDate,0),
            'leftDate': (!current.leftDate)? null : functionSupport.castDate(current.leftDate,0),
            'sex': current.sex,
            'address': current.address,
            'cellphone': current.cellphone,
            'idcard': current.idcard,
            'email': current.email,
            'degreeId': current.degreeId,
            'ReligionId': current.ReligionId,
            'MaritalStatus': current.MaritalStatus
        })
        return value;
    },[]);
    const listemployee = await collEmployee.insertMany(dataForInsert);
    return listemployee;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        connect.close();
    }
}
//#endregion
//----------------------------- create employee --------------------------------// end

//----------------------------- update employee--------------------------------// begin
//#region 
async function updateEmployee(body)
{
    const connect = await mongodb.connect(connectString);
    try {
    const dataClient = body.body;
    let totalRowsAffect = body.body.length;    
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    for(let current of dataClient)
    {
     const filter = {'employeeId':  current.employeeId};
     const listDataUpdate = 
        {   
        $set:{
            'employeeName': current.employeeName,
            'birthDate': functionSupport.castDate(current.birthDate,0),
            'employedDate': functionSupport.castDate(current.employedDate,0),
            'leftDate': (!current.leftDate)? null : functionSupport.castDate(current.leftDate,0),
            'sex': current.sex,
            'address': current.address,
            'cellphone': current.cellphone,
            'idcard': current.idcard,
            'email': current.email,
            'degreeId': current.degreeId,
            'ReligionId': current.ReligionId,
            'MaritalStatus': current.MaritalStatus
        }
        };
    const respone = await connect.db('humanproject').collection('tblemployee').updateOne(filter,listDataUpdate);
    totalRowsAffect -= (respone.modifiedCount === 0)? 1 : 0;
    }
    return status(totalRowsAffect,1);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        connect.close();
    }
}
//#endregion
//----------------------------- udpate employee --------------------------------// end

//----------------------------- delete employee--------------------------------// begin
//#region 
async function deleteEmployee(body)
{
    const connect = await mongodb.connect(connectString);
    try {
    const dataClient = body.body;
    let totalRowsAffect = dataClient.length;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    for(let ele of dataClient)
    {
        const dataForDelete = {
            employeeId: ele.employeeId
        }
        const respone = await connect.db('humanproject').collection('tblemployee').deleteOne(dataForDelete);
        totalRowsAffect -= (respone.deletedCount === 0)? 1 :0 ;
    }
    return status(totalRowsAffect,2);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        connect.close();
    }
}
//#endregion
//----------------------------- delete employee --------------------------------// end




module.exports = {
    getemployee: getemployee,
    createEmployee: createEmployee,
    updateEmployee: updateEmployee,
    deleteEmployee: deleteEmployee
};