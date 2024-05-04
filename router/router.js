const express = require('express');
const router = express.Router();
const employeeCRUD = require('../databaseOperations/masterData/employeeCRUD');
const departmentCRUD = require('../databaseOperations/department/departmentCRUD');
const departmentFunction = require('../databaseOperations/department/departmentFunction');
const positionCRUD = require('../databaseOperations/position/positionCRUD');
const positionFunction = require('../databaseOperations/position/positionFunction');
const contractionCRUD = require('../databaseOperations/contract/contractCRUD');
const contracitonFunction = require('../databaseOperations/contract/contractFunction');
const empTypeCRUD = require('../databaseOperations/emptype/emptypeCRUD');
const empTypeFunction = require('../databaseOperations/emptype/emptypeFunction');
const totalWdCRUD = require('../databaseOperations/timekeeping/totalWDCRUD');
const totalWDFunction = require('../databaseOperations/timekeeping/totalWDFunction');
const allowanceCRUD =  require('../databaseOperations/payroll/allowance/allowanceCRUD');
const allowanceFunction = require('../databaseOperations/payroll/allowance/allowanceFunction');
const allowanceFixCRUD = require('../databaseOperations/payroll/allowanceFix/allowanceFixCRUD');
const allowanceFixFunction = require('../databaseOperations/payroll/allowanceFix/allowanceFixFunction');
const salaryCRUD = require('../databaseOperations/payroll/salary/salaryCRUD');
const salaryFunction = require('../databaseOperations/payroll/salary/salaryFunction');
const addDeductCRUD = require('../databaseOperations/payroll/addDeduct/addDeductCRUD');
const addDeductFunction = require('../databaseOperations/payroll/addDeduct/addDeductFunction');
const payrollCRUD = require('../databaseOperations/payroll/payroll/payrollCRUD');
const payrollFunction = require('../databaseOperations/payroll/payroll/payrollFunction');
const parameterCRUD = require('../databaseOperations/payroll/parameter/payrollParameterCRUD');
const parameterFunction = require('../databaseOperations/payroll/parameter/payrollParameterFunction');

//---------------------- employee's router ------------------------// begin
//#region 
// get list employee's router

router.get('/getEmployee/:empid',(req,res,next) =>{
    const empid = req.params.empid;
    employeeCRUD.getemployee(empid).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// create employee's router

router.post('/createEmployee',(req,res,next)=>{
   
    employeeCRUD.createEmployee(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// update employee's router

router.post('/updateEmployee',(req,res,next)=>{
   
    employeeCRUD.updateEmployee(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// delete employee's router

router.post('/deleteEmployee',(req,res,next)=>{
   
    employeeCRUD.deleteEmployee(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

//#endregion
//---------------------- employee's router ------------------------// end

//---------------------- department structure's router ------------------------// begin
//#region 

// create deparment structure

router.post('/createDepartmentStructure',(req,res,next) => {
    departmentCRUD.createDepartmentStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// update deparment structure

router.post('/updateDepartmentStructure',(req,res,next) => {
    departmentCRUD.updateDepartmentStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});


// delete deparment structure

router.post('/deleteDepartmentStructure',(req,res,next) => {
    departmentCRUD.deleteDepartmentStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});


//#endregion
//---------------------- department structure's router ------------------------// end

//---------------------- employee department's router ------------------------// begin
//#region 

// create employee deparment 

router.post('/createEmployeeDepartment',(req,res,next) => {
    departmentCRUD.createEmployeeDepartment(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// update employee deparment 

router.post('/updateEmployeeDepartment',(req,res,next) => {
    departmentCRUD.updateEmployeeDepartment(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});


// delete employee deparment 

router.post('/deleteEmployeeDepartment',(req,res,next) => {
    departmentCRUD.deleteEmployeeDepartment(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// get max department

router.get('/getmaxdepartment/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    departmentFunction.ufnGetMaxDep(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// get list history change department

router.get('/gethistorychangedep/:fromdate/:todate',(req,res,next) =>{
    const fromdate = req.params.fromdate, todate = req.params.todate;
    departmentFunction.changeDepHistory(fromdate,todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});


//#endregion
//---------------------- employee department's router ------------------------// end


//---------------------- position structure  ------------------------// begin
//#region 

// create position structure
router.post('/createPositionStructure',(req,res,next) =>{
    positionCRUD.createpositionStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update position structure
router.post('/updatePositionStructure',(req,res,next) =>{
    positionCRUD.updatepositionStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete position structure
router.post('/deletePositionStructure',(req,res,next) =>{
    positionCRUD.deletepositionStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

//#endregion
//---------------------- position structure  ------------------------// end


//---------------------- employee's position  ------------------------// begin
//#region 

// create employee's position
router.post('/createEmployeePosition',(req,res,next) =>{
    positionCRUD.createEmployeeposition(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's position
router.post('/updateEmployeePosition',(req,res,next) =>{
    positionCRUD.updateEmployeeposition(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's position
router.post('/deleteEmployeePosition',(req,res,next) =>{
    positionCRUD.deleteEmployeeposition(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max position
router.get('/getmaxposition/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    positionFunction.ufnGetMaxPos(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// get list history change position
router.get('/gethistorychangepos/:fromdate/:todate',(req,res,next) =>{
    const fromdate = req.params.fromdate, todate = req.params.todate;
    positionFunction.changePosHistory(fromdate,todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

//#endregion
//---------------------- employee's position  ------------------------// end


//---------------------- contraction structure  ------------------------// begin
//#region 

// create contraction structure
router.post('/createContractionStructure',(req,res,next) =>{
    contractionCRUD.createcontractionStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update contraction structure
router.post('/updateContractionStructure',(req,res,next) =>{
    contractionCRUD.updatecontractionStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete contraction structure
router.post('/deleteContractionStructure',(req,res,next) =>{
    contractionCRUD.deletecontractionStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

//#endregion
//---------------------- contraction structure  ------------------------// end


//---------------------- employee's contraction  ------------------------// begin
//#region 

// create employee's contraction
router.post('/createEmployeeContraction',(req,res,next) =>{
    contractionCRUD.createEmployeecontraction(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's contraction
router.post('/updateEmployeeContraction',(req,res,next) =>{
    contractionCRUD.updateEmployeecontraction(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's contraction
router.post('/deleteEmployeeContraction',(req,res,next) =>{
    contractionCRUD.deleteEmployeecontraction(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max contraction
router.get('/getmaxcontraction/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    contracitonFunction.getmaxContract(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});


// renew contraction
router.post('/renewContract/:fromdate/:todate/:contractTypeId',(req,res,next) =>{
    const fromdate = req.params.fromdate, todate = req.params.todate, contractTypeId = req.params.contractTypeId ;
    contracitonFunction.renewContract(fromdate,todate,contractTypeId).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});


//#endregion
//---------------------- employee's contraction  ------------------------// end




//---------------------- emptype structure  ------------------------// begin
//#region 

// create emptype structure
router.post('/createEmpTypeStructure',(req,res,next) =>{
    empTypeCRUD.createtypeStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update emptype structure
router.post('/updateEmpTypeStructure',(req,res,next) =>{
    empTypeCRUD.updatetypeStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete emptype structure
router.post('/deleteEmpTypeStructure',(req,res,next) =>{
    empTypeCRUD.deletetypeStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

//#endregion
//---------------------- emptype structure  ------------------------// end


//---------------------- employee's type  ------------------------// begin
//#region 

// create employee's type
router.post('/createEmployeeType',(req,res,next) =>{
    empTypeCRUD.createEmployeetype(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's type
router.post('/updateEmployeeType',(req,res,next) =>{
    empTypeCRUD.updateEmployeetype(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's type
router.post('/deleteEmployeeType',(req,res,next) =>{
    empTypeCRUD.deleteEmployeetype(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max type
router.get('/getmaxempType/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    empTypeFunction.getmaxempType(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// get total employee by each employee's type
router.get('/gettotalempType/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    empTypeFunction.totalEmployeeByEmpType(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

//#endregion
//---------------------- employee's type  ------------------------// end



//---------------------- totalWD  ------------------------// begin
//#region 

// create totalWD
router.post('/createTotalWD',(req,res,next) =>{
    totalWdCRUD.createTotalWD (req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update totalWD
router.post('/updateTotalWD',(req,res,next) =>{
    totalWdCRUD.updateTotalWD(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete totalWD
router.post('/deleteTotalWD',(req,res,next) =>{
    totalWdCRUD.deleteTotalWD(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

//get totalOT
router.get('/getTotalOT/:monthid/:yearid',(req,res,next) =>{
    const monthid = req.params.monthid, yearid = req.params.yearid;
    totalWDFunction.getTotalOT(monthid,yearid).then(
        dataRespone => res.json(dataRespone) 
    ).catch(
        err => next(err)
    )
});

//get totalLeave
router.get('/getTotalLeave/:monthid/:yearid',(req,res,next) =>{
    const monthid = req.params.monthid, yearid = req.params.yearid;
    totalWDFunction.getTotalLeave(monthid,yearid).then(
        dataRespone => res.json(dataRespone) 
    ).catch(
        err => next(err)
    )
});

//#endregion
//---------------------- totalWD  ------------------------// end



//---------------------- allowance structure  ------------------------// begin
//#region 

// create allowance structure
router.post('/createAllowanceStructure',(req,res,next) =>{
    allowanceCRUD.createallowanceStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update allowance structure
router.post('/updateAllowanceStructure',(req,res,next) =>{
    allowanceCRUD.updateallowanceStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete allowance structure
router.post('/deleteAllowanceStructure',(req,res,next) =>{
    allowanceCRUD.deleteallowanceStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

//#endregion
//---------------------- allowance structure  ------------------------// end


//---------------------- employee's allowance  ------------------------// begin
//#region 

// create employee's allowance
router.post('/createEmployeeAllowance',(req,res,next) =>{
    allowanceCRUD.createEmployeeallowance(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's allowance
router.post('/updateEmployeeAllowance',(req,res,next) =>{
    allowanceCRUD.updateEmployeeallowance(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's allowance
router.post('/deleteEmployeeAllowance',(req,res,next) =>{
    allowanceCRUD.deleteEmployeeallowance(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max allowance

router.get('/getmaxAllowance/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    allowanceFunction.getmaxAllowane(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});


//#endregion
//---------------------- employee's allowance  ------------------------// end


//---------------------- employee's allowanceFix  ------------------------// begin
//#region 

// create employee's allowanceFix
router.post('/createEmployeeAllowanceFix',(req,res,next) =>{
    allowanceFixCRUD.createEmployeeallowanceFix(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's allowanceFix
router.post('/updateEmployeeAllowanceFix',(req,res,next) =>{
    allowanceFixCRUD.updateEmployeeallowanceFix(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's allowanceFix
router.post('/deleteEmployeeAllowanceFix',(req,res,next) =>{
    allowanceFixCRUD.deleteEmployeeallowanceFix(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max allowanceFix

router.get('/getmaxAllowanceFix/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    allowanceFixFunction.getmaxAllowaneFix(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});


//#endregion
//---------------------- employee's allowance  ------------------------// end

//---------------------- employee's salary  ------------------------// begin
//#region 

// create employee's salary
router.post('/createEmployeeSalary',(req,res,next) =>{
    salaryCRUD.createsalary(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's salary
router.post('/updateEmployeeSalary',(req,res,next) =>{
    salaryCRUD.updatesalary(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's salary
router.post('/deleteEmployeeSalary',(req,res,next) =>{
    salaryCRUD.deletesalary(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max salary

router.get('/getmaxSalary/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    salaryFunction.getmaxSalary(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});


//#endregion
//---------------------- employee's salary  ------------------------// end



//---------------------- addDeduct structure  ------------------------// begin
//#region 

// create allowance addDeduct
router.post('/createAddDeductStructure',(req,res,next) =>{
    addDeductCRUD.createAddDeductStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update allowance addDeduct
router.post('/updateAddDeductStructure',(req,res,next) =>{
    addDeductCRUD.updateAddDeductStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete allowance addDeduct
router.post('/deleteAddDeductStructure',(req,res,next) =>{
    addDeductCRUD.deleteAddDeductStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

//#endregion
//---------------------- addDeduct structure  ------------------------// end


//---------------------- employee's addDeduct  ------------------------// begin
//#region 

// create employee's addDeduct
router.post('/createEmployeeaddDeduct',(req,res,next) =>{
    addDeductCRUD.createEmployeeAddDeduct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's addDeduct
router.post('/updateEmployeeaddDeduct',(req,res,next) =>{
    addDeductCRUD.updateEmployeeAddDeduct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's addDeduct
router.post('/deleteEmployeeaddDeduct',(req,res,next) =>{
    addDeductCRUD.deleteEmployeeAddDeduct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max addDeduct

router.get('/getmaxaddDeduct/:todate/:adopt',(req,res,next) =>{
    const todate = req.params.todate, adopt = req.params.adopt;
    addDeductFunction.getmaxaddDeduct(todate,adopt).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});


//#endregion
//---------------------- employee's addDeduct  ------------------------// end


//---------------------- employee's payroll  ------------------------// begin
//#region 

// create employee's payroll
router.post('/createEmployeePayroll',(req,res,next) =>{
    payrollCRUD.createpayroll(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's payroll
router.post('/updateEmployeePayroll',(req,res,next) =>{
    payrollCRUD.updatepayroll(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's payroll
router.post('/deleteEmployeePayroll',(req,res,next) =>{
    payrollCRUD.deletepayroll(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// call payroll

router.post('/calpayroll/:yearid/:monthid',(req,res,next) =>{
    const yearid = req.params.yearid, monthid = req.params.monthid;
    payrollFunction.callPayroll(monthid,yearid,'').then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

//#endregion
//---------------------- employee's payroll  ------------------------// end


//---------------------- parameter ------------------------// begin
//#region 

// create employee's payroll
router.post('/createParameter',(req,res,next) =>{
    parameterCRUD.createparameter(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's payroll
router.post('/updateParameter',(req,res,next) =>{
    parameterCRUD.updateparameter(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's payroll
router.post('/deleteParameter',(req,res,next) =>{
    parameterCRUD.deleteparameter(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get list parameter

router.get('/getListParameter',(req,res,next) =>{

    parameterFunction.getListparameter().then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});


//#endregion
//---------------------- parameter ------------------------// end

module.exports = router;