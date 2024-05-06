const { Decimal128, Int32, Double } = require('mongodb');
const connectString = require('../../../databaseConnections/mongoDbConnection');
//const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../../other/supportFunction');
const status = require("../../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const validateSupport = require('../../../other/supportValidateSchema');
const momentJS = require('moment');
const { castDate } = require('../../../other/supportFunction');
const dbName = "humanproject";
const statusRequest = require('../../../other/supportStatus').statusRequest;


//----------------------------- create payroll --------------------------------// begin
//#region 

async function createpayroll(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_payroll = 'tblpayroll';
    const coll_payroll = db.collection(tblname_payroll);
    const getListpayroll = await coll_payroll.find({}).project({_id:0, employeeId: 1, monthId: 1, yearId: 1}).toArray();
    

    const validateSchema = {...validateSupport(tblname_payroll,null)};
    try {
    await db.createCollection(tblname_payroll,{
        validator: validateSchema
    });
    } catch (error) {
    await db.command({
        collMod: tblname_payroll,
        validator: validateSchema
    });
    }
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    let dataClientFilter = dataClient.filter((ele) => (
        getListpayroll.some(eleInner =>
            eleInner.employeeId === ele.employeeId &&
            eleInner.monthId === ele.monthId &&
            eleInner.yearId === ele.yearId
        ) === true)?  false: true);

    if(dataClientFilter.length === 0) return status(0,0);
    dataClientFilter = dataClientFilter.map(ele =>({
        yearId : Number(ele.yearId),
        monthId : Number(ele.monthId),
        employeeId : ele.employeeId,
        employedDate : castDate(ele.employedDate,0),
        birthDate : castDate(ele.birthDate,0),
        leftDate : castDate(ele.leftDate,0),
        sexName : ele.sexName,
        WD : new Double(ele.WD),
        WN : new Double(ele.WN),
        totalWD : new Double(ele.totalWD),
        AL : new Double(ele.AL),
        PH : new Double(ele.PH),
        CL : new Double(ele.CL),
        KL : new Double(ele.KL),
        totalLeaveCL : new Double(ele.totalLeaveCL),
        totalLeaveKL : new Double(ele.totalLeaveKL),
        totalLeave : new Double(ele.totalLeave),
        OT15 : new Double(ele.OT15),
        OT20 : new Double(ele.OT20),
        OT30 : new Double(ele.OT30),
        OT15N : new Double(ele.OT15N),
        OT20N : new Double(ele.OT20N),
        OT30N : new Double(ele.OT30N),
        totalOTDay : new Double(ele.totalOTDay),
        totalOTNight : new Double(ele.totalOTNight),
        totalOT : new Double(ele.totalOT),
        WDSal : new Double(ele.WDSal),
        WNSal : new Double(ele.WNSal),
        totalWDSal : new Double(ele.totalWDSal),
        ALSal : new Double(ele.ALSal),
        PHSal : new Double(ele.PHSal),
        CLSal : new Double(ele.CLSal),
        KLSal : new Double(ele.KLSal),
        totalLeaveCLSal : new Double(ele.totalLeaveCLSal),
        totalLeaveKLSal : new Double(ele.totalLeaveKLSal),
        totalLeaveSal : new Double(ele.totalLeaveSal),
        OT15Sal : new Double(ele.OT15Sal),
        OT20Sal : new Double(ele.OT20Sal),
        OT30Sal : new Double(ele.OT30Sal),
        OT15NSal : new Double(ele.OT15NSal),
        OT20NSal : new Double(ele.OT20NSal),
        OT30NSal : new Double(ele.OT30NSal),
        totalOTSalDay : new Double(ele.totalOTSalDay),
        totalOTSal : new Double(ele.totalOTSal),
        OT15SalTax : new Double(ele.OT15SalTax),
        OT20SalTax : new Double(ele.OT20SalTax),
        OT30SalTax : new Double(ele.OT30SalTax),
        OT15NSalTax : new Double(ele.OT15NSalTax),
        OT20NSalTax : new Double(ele.OT20NSalTax),
        OT30NSalTax : new Double(ele.OT30NSalTax),
        totalOTSalTax : new Double(ele.totalOTSalTax),
        totalAllowanceSal : new Double(ele.totalAllowanceSal),
        totalAllowanceTaxSal : new Double(ele.totalAllowanceTaxSal),
        totalAllowanceFixSal : new Double(ele.totalAllowanceFixSal),
        totalAllowanceFixTaxSal : new Double(ele.totalAllowanceFixTaxSal),
        totalAddSal : new Double(ele.totalAddSal),
        totalAddTaxSal : new Double(ele.totalAddTaxSal),
        totalDeductSal : new Double(ele.totalDeductSal),
        totalDeductTaxSal : new Double(ele.totalDeductTaxSal),
        SI_emp : new Double(ele.SI_emp),
        HI_emp : new Double(ele.HI_emp),
        UI_emp : new Double(ele.UI_emp),
        Ins_emp_total : new Double(ele.Ins_emp_total),
        SI_comp : new Double(ele.SI_comp),
        HI_comp : new Double(ele.HI_comp),
        UI_comp : new Double(ele.UI_comp),
        Ins_comp_total : new Double(ele.Ins_comp_total),
        totalFamilyDepen : new Double(ele.totalFamilyDepen),
        totalFamilyDepenSal : new Double(ele.totalFamilyDepenSal),
        totalSal : new Double(ele.totalSal),
        totalSalTax : new Double(ele.totalSalTax),
        incomeTax : new Double(ele.incomeTax),
        takehome : new Double(ele.takehome),
        takehomeRound : new Double(ele.takehomeRound),
    }));
    console.log(dataClientFilter);
    const respone = await coll_payroll.insertMany(dataClientFilter);
    return respone;
    } catch (error) {
    //console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}

//----------------------------- create payroll --------------------------------// end
//#endregion 


//----------------------------- update payroll --------------------------------// begin
//#region 

async function updatepayroll(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_payroll = 'tblpayroll';
    const coll_payroll = db.collection(tblname_payroll);
    //const getListpayroll = await coll_payroll.find({}).project({_id:0, monthId: 1, yearId: 1, employeeId: 1}).toArray();
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    let totalRowsAffect = 0;
    for(let ele of dataClient )
    {
        const _id = {_id: new objectIdmg(ele._id)};
        const data = {
            $set:{
                // yearId : Number(ele.yearId),
                // monthId : Number(ele.monthId),
                // employeeId : ele.employeeId,
                // employedDate : castDate(ele.employedDate,0),
                // birthDate : castDate(ele.birthDate,0),
                // leftDate : castDate(ele.leftDate,0),
                // sexName : ele.sexName,
                WD : new Double(ele.WD),
                WN : new Double(ele.WN),
                totalWD : new Double(ele.totalWD),
                AL : new Double(ele.AL),
                PH : new Double(ele.PH),
                CL : new Double(ele.CL),
                KL : new Double(ele.KL),
                totalLeaveCL : new Double(ele.totalLeaveCL),
                totalLeaveKL : new Double(ele.totalLeaveKL),
                totalLeave : new Double(ele.totalLeave),
                OT15 : new Double(ele.OT15),
                OT20 : new Double(ele.OT20),
                OT30 : new Double(ele.OT30),
                OT15N : new Double(ele.OT15N),
                OT20N : new Double(ele.OT20N),
                OT30N : new Double(ele.OT30N),
                totalOTDay : new Double(ele.totalOTDay),
                totalOTNight : new Double(ele.totalOTNight),
                totalOT : new Double(ele.totalOT),
                WDSal : new Double(ele.WDSal),
                WNSal : new Double(ele.WNSal),
                totalWDSal : new Double(ele.totalWDSal),
                ALSal : new Double(ele.ALSal),
                PHSal : new Double(ele.PHSal),
                CLSal : new Double(ele.CLSal),
                KLSal : new Double(ele.KLSal),
                totalLeaveCLSal : new Double(ele.totalLeaveCLSal),
                totalLeaveKLSal : new Double(ele.totalLeaveKLSal),
                totalLeaveSal : new Double(ele.totalLeaveSal),
                OT15Sal : new Double(ele.OT15Sal),
                OT20Sal : new Double(ele.OT20Sal),
                OT30Sal : new Double(ele.OT30Sal),
                OT15NSal : new Double(ele.OT15NSal),
                OT20NSal : new Double(ele.OT20NSal),
                OT30NSal : new Double(ele.OT30NSal),
                totalOTSalDay : new Double(ele.totalOTSalDay),
                totalOTSal : new Double(ele.totalOTSal),
                OT15SalTax : new Double(ele.OT15SalTax),
                OT20SalTax : new Double(ele.OT20SalTax),
                OT30SalTax : new Double(ele.OT30SalTax),
                OT15NSalTax : new Double(ele.OT15NSalTax),
                OT20NSalTax : new Double(ele.OT20NSalTax),
                OT30NSalTax : new Double(ele.OT30NSalTax),
                totalOTSalTax : new Double(ele.totalOTSalTax),
                totalAllowanceSal : new Double(ele.totalAllowanceSal),
                totalAllowanceTaxSal : new Double(ele.totalAllowanceTaxSal),
                totalAllowanceFixSal : new Double(ele.totalAllowanceFixSal),
                totalAllowanceFixTaxSal : new Double(ele.totalAllowanceFixTaxSal),
                totalAddSal : new Double(ele.totalAddSal),
                totalAddTaxSal : new Double(ele.totalAddTaxSal),
                totalDeductSal : new Double(ele.totalDeductSal),
                totalDeductTaxSal : new Double(ele.totalDeductTaxSal),
                SI_emp : new Double(ele.SI_emp),
                HI_emp : new Double(ele.HI_emp),
                UI_emp : new Double(ele.UI_emp),
                Ins_emp_total : new Double(ele.Ins_emp_total),
                SI_comp : new Double(ele.SI_comp),
                HI_comp : new Double(ele.HI_comp),
                UI_comp : new Double(ele.UI_comp),
                Ins_comp_total : new Double(ele.Ins_comp_total),
                totalFamilyDepen : new Double(ele.totalFamilyDepen),
                totalFamilyDepenSal : new Double(ele.totalFamilyDepenSal),
                totalSal : new Double(ele.totalSal),
                totalSalTax : new Double(ele.totalSalTax),
                incomeTax : new Double(ele.incomeTax),
                takehome : new Double(ele.takehome),
                takehomeRound : new Double(ele.takehomeRound),
            }};
        const respone = await coll_payroll.updateOne(_id,data);
        totalRowsAffect  += (respone.modifiedCount === 1)? 1: 0;
    }
    return status(totalRowsAffect,1);
    } catch (error) {
    //console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}

//----------------------------- update payroll --------------------------------// end
//#endregion 


//----------------------------- delete payroll --------------------------------// begin
//#region 

async function deletepayroll(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblname_payroll = 'tblpayroll';
    const coll_payroll = db.collection(tblname_payroll);
    //const getListpayroll = await coll_payroll.find({}).project({_id:0, monthId: 1, yearId: 1, employeeId: 1}).toArray();
    try {
    const dataClient = body.body;
    if(!(dataClient instanceof Array)) throw statusRequest(0).message;
    let totalRowsAffect = 0;
    for(let ele of dataClient )
    {
        const _id = {_id: new objectIdmg(ele._id)};
        const respone = await coll_payroll.deleteOne(_id);
        totalRowsAffect  += (respone.deletedCount === 1)? 1: 0;
    }
    return status(totalRowsAffect,1);
    } catch (error) {
    //console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}

//----------------------------- delete payroll --------------------------------// end
//#endregion 

module.exports = {
    createpayroll: createpayroll,
    updatepayroll: updatepayroll,
    deletepayroll: deletepayroll
};