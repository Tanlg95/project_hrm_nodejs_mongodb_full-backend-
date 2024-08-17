const express = require('express');
const router = express.Router();

const authToken = require('../databaseOperations/login/token/tokenFunction').authToken;

const listRouter = { 
        employeeCRUD : require('../databaseOperations/masterData/employeeCRUD'),
        departmentCRUD : require('../databaseOperations/department/departmentCRUD'),
        departmentFunction : require('../databaseOperations/department/departmentFunction'),
        positionCRUD : require('../databaseOperations/position/positionCRUD'),
        positionFunction : require('../databaseOperations/position/positionFunction'),
        contractionCRUD : require('../databaseOperations/contract/contractCRUD'),
        contracitonFunction : require('../databaseOperations/contract/contractFunction'),
        empTypeCRUD : require('../databaseOperations/emptype/emptypeCRUD'),
        empTypeFunction : require('../databaseOperations/emptype/emptypeFunction'),
        totalWdCRUD : require('../databaseOperations/timekeeping/totalWDCRUD'),
        totalWDFunction : require('../databaseOperations/timekeeping/totalWDFunction'),
        allowanceCRUD :  require('../databaseOperations/payroll/allowance/allowanceCRUD'),
        allowanceFunction : require('../databaseOperations/payroll/allowance/allowanceFunction'),
        allowanceFixCRUD : require('../databaseOperations/payroll/allowanceFix/allowanceFixCRUD'),
        allowanceFixFunction : require('../databaseOperations/payroll/allowanceFix/allowanceFixFunction'),
        salaryCRUD : require('../databaseOperations/payroll/salary/salaryCRUD'),
        salaryFunction : require('../databaseOperations/payroll/salary/salaryFunction'),
        addDeductCRUD : require('../databaseOperations/payroll/addDeduct/addDeductCRUD'),
        addDeductFunction : require('../databaseOperations/payroll/addDeduct/addDeductFunction'),
        payrollCRUD : require('../databaseOperations/payroll/payroll/payrollCRUD'),
        payrollFunction : require('../databaseOperations/payroll/payroll/payrollFunction'),
        parameterCRUD : require('../databaseOperations/payroll/parameter/payrollParameterCRUD'),
        parameterFunction : require('../databaseOperations/payroll/parameter/payrollParameterFunction'),
        accountCRUD : require('../databaseOperations/login/account/accountCRUD'),
        accountFunction : require('../databaseOperations/login/account/accountFunction'),
        relationCRUD : require('../databaseOperations/familyDepen/familyDepenCRUD'),
        relationFunction : require('../databaseOperations/familyDepen/familyDepenFunction'),
        emp7hCRUD: require('../databaseOperations/emp7h/emp7hCRUD'),
        emp7hFunction: require('../databaseOperations/emp7h/emp7hFunction'),
        roleCRUD: require('../databaseOperations/systems/role/roleCRUD'),
        roleFunction: require('../databaseOperations/systems/role/roleFunction'),
        collectionCURD: require('../databaseDDL/databaseDDL_CRUD'),
};


//---------------------- employee's router ------------------------// begin
//#region 
// get list employee's router

router.get('/api/employee/function/get/:empid',(req,res,next) =>{
    const empid = req.params.empid;
    listRouter.employeeCRUD.getemployee(empid).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// create employee's router

router.post('/api/employee/CRUD/C',(req,res,next)=>{

    listRouter.employeeCRUD.createEmployee(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// update employee's router

router.post('/api/employee/CRUD/U',(req,res,next)=>{
   
    listRouter.employeeCRUD.updateEmployee(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// delete employee's router

router.post('/api/employee/CRUD/D',(req,res,next)=>{
   
    listRouter.employeeCRUD.deleteEmployee(req).then(
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

router.post('/api/department/CRUD/C',(req,res,next) => {
    listRouter.departmentCRUD.createDepartmentStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// update deparment structure

router.post('/api/department/CRUD/U',(req,res,next) => {
    listRouter.departmentCRUD.updateDepartmentStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});


// delete deparment structure

router.post('/api/department/CRUD/D',(req,res,next) => {
    listRouter.departmentCRUD.deleteDepartmentStruct(req).then(
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

router.post('/api/department/emp/CRUD/C',(req,res,next) => {
    listRouter.departmentCRUD.createEmployeeDepartment(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// update employee deparment 

router.post('/api/department/emp/CRUD/U',(req,res,next) => {
    listRouter.departmentCRUD.updateEmployeeDepartment(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});


// delete employee deparment 

router.post('/api/department/emp/CRUD/D',(req,res,next) => {
    listRouter.departmentCRUD.deleteEmployeeDepartment(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// get max department

router.get('/api/department/emp/function/getMaxDep/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    listRouter.departmentFunction.ufnGetMaxDep(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// get list history change department

router.get('/api/department/emp/function/getHisDep/:fromdate/:todate',(req,res,next) =>{
    const fromdate = req.params.fromdate, todate = req.params.todate;
    listRouter.departmentFunction.changeDepHistory(fromdate,todate).then(
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
router.post('/api/position/CRUD/C',(req,res,next) =>{
    listRouter.positionCRUD.createpositionStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update position structure
router.post('/api/position/CRUD/U',(req,res,next) =>{
    listRouter.positionCRUD.updatepositionStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete position structure
router.post('/api/position/CRUD/D',(req,res,next) =>{
    listRouter.positionCRUD.deletepositionStruct(req).then(
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
router.post('/api/position/emp/CRUD/C',(req,res,next) =>{
    listRouter.positionCRUD.createEmployeeposition(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's position
router.post('/api/position/emp/CRUD/U',(req,res,next) =>{
    listRouter.positionCRUD.updateEmployeeposition(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's position
router.post('/api/position/emp/CRUD/D',(req,res,next) =>{
    listRouter.positionCRUD.deleteEmployeeposition(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max position
router.get('/api/position/function/getMaxPos/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    listRouter.positionFunction.ufnGetMaxPos(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// get list history change position
router.get('/api/position/function/getHisPos/:fromdate/:todate',(req,res,next) =>{
    const fromdate = req.params.fromdate, todate = req.params.todate;
    listRouter.positionFunction.changePosHistory(fromdate,todate).then(
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
router.post('/api/contract/CRUD/C',(req,res,next) =>{
    listRouter.contractionCRUD.createcontractionStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update contraction structure
router.post('//api/contract/CRUD/U',(req,res,next) =>{
    listRouter.contractionCRUD.updatecontractionStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete contraction structure
router.post('/api/contract/CRUD/D',(req,res,next) =>{
    listRouter.contractionCRUD.deletecontractionStruct(req).then(
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
router.post('/api/contract/emp/CRUD/C',(req,res,next) =>{
    listRouter.contractionCRUD.createEmployeecontraction(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's contraction
router.post('/api/contract/emp/CRUD/U',(req,res,next) =>{
    listRouter.contractionCRUD.updateEmployeecontraction(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's contraction
router.post('/api/contract/emp/CRUD/D',(req,res,next) =>{
    listRouter.contractionCRUD.deleteEmployeecontraction(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max contraction
router.get('/api/contract/function/getMaxContract/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    listRouter.contracitonFunction.getmaxContract(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});


// renew contraction
router.post('/api/contract/function/renewContract/:fromdate/:todate/:contractTypeId',(req,res,next) =>{
    const fromdate = req.params.fromdate, todate = req.params.todate, contractTypeId = req.params.contractTypeId ;
    listRouter.contracitonFunction.renewContract(fromdate,todate,contractTypeId).then(
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
router.post('/api/empType/CRUD/C',(req,res,next) =>{
    listRouter.empTypeCRUD.createtypeStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update emptype structure
router.post('/api/empType/CRUD/U',(req,res,next) =>{
    listRouter.empTypeCRUD.updatetypeStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete emptype structure
router.post('/api/empType/CRUD/D',(req,res,next) =>{
    listRouter.empTypeCRUD.deletetypeStruct(req).then(
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
router.post('/api/empType/emp/CRUD/C',(req,res,next) =>{
    listRouter.empTypeCRUD.createEmployeetype(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's type
router.post('/api/empType/emp/CRUD/U',(req,res,next) =>{
    listRouter.empTypeCRUD.updateEmployeetype(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's type
router.post('/api/empType/emp/CRUD/D',(req,res,next) =>{
    listRouter.empTypeCRUD.deleteEmployeetype(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max type
router.get('/api/empType/function/getMaxEmpType/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    listRouter.empTypeFunction.getmaxempType(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

// get total employee by each employee's type
router.get('/api/empType/function/totalEmpType/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    listRouter.empTypeFunction.totalEmployeeByEmpType(todate).then(
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
router.post('/api/totalWD/CRUD/C',(req,res,next) =>{
    listRouter.totalWdCRUD.createTotalWD (req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update totalWD
router.post('/api/totalWD/CRUD/U',(req,res,next) =>{
    listRouter.totalWdCRUD.updateTotalWD(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete totalWD
router.post('/api/totalWD/CRUD/D',(req,res,next) =>{
    listRouter.totalWdCRUD.deleteTotalWD(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

//get totalOT
router.get('/api/totalWD/function/getTotalOT/:monthid/:yearid',(req,res,next) =>{
    const monthid = req.params.monthid, yearid = req.params.yearid;
    listRouter.totalWDFunction.getTotalOT(monthid,yearid).then(
        dataRespone => res.json(dataRespone) 
    ).catch(
        err => next(err)
    )
});

//get totalLeave
router.get('/api/totalWD/function/getTotalLeave/:monthid/:yearid',(req,res,next) =>{
    const monthid = req.params.monthid, yearid = req.params.yearid;
    listRouter.totalWDFunction.getTotalLeave(monthid,yearid).then(
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
router.post('/api/allowance/CRUD/C',(req,res,next) =>{
    listRouter.allowanceCRUD.createallowanceStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update allowance structure
router.post('/api/allowance/CRUD/U',(req,res,next) =>{
    listRouter.allowanceCRUD.updateallowanceStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete allowance structure
router.post('/api/allowance/CRUD/D',(req,res,next) =>{
    listRouter.allowanceCRUD.deleteallowanceStruct(req).then(
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
router.post('/api/allowance/emp/CRUD/C',(req,res,next) =>{
    listRouter.allowanceCRUD.createEmployeeallowance(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's allowance
router.post('/api/allowance/emp/CRUD/U',(req,res,next) =>{
    listRouter.allowanceCRUD.updateEmployeeallowance(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's allowance
router.post('/api/allowance/emp/CRUD/D',(req,res,next) =>{
    listRouter.allowanceCRUD.deleteEmployeeallowance(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max allowance

router.get('/api/allowance/function/getMaxAll/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    listRouter.allowanceFunction.getmaxAllowane(todate).then(
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
router.post('/api/allowanceFix/emp/CRUD/C',(req,res,next) =>{
    listRouter.allowanceFixCRUD.createEmployeeallowanceFix(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's allowanceFix
router.post('/api/allowanceFix/emp/CRUD/U',(req,res,next) =>{
    listRouter.allowanceFixCRUD.updateEmployeeallowanceFix(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's allowanceFix
router.post('/api/allowanceFix/emp/CRUD/D',(req,res,next) =>{
    listRouter.allowanceFixCRUD.deleteEmployeeallowanceFix(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max allowanceFix

router.get('/api/allowanceFix/function/getMaxAllFix/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    listRouter.allowanceFixFunction.getmaxAllowaneFix(todate).then(
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
router.post('/api/bsal/CRUD/C',(req,res,next) =>{
    listRouter.salaryCRUD.createsalary(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's salary
router.post('/api/bsal/CRUD/U',(req,res,next) =>{
    listRouter.salaryCRUD.updatesalary(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's salary
router.post('/api/bsal/CRUD/D',(req,res,next) =>{
    listRouter.salaryCRUD.deletesalary(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max salary

router.get('/api/bsal/function/getMaxbsal/:todate',(req,res,next) =>{
    const todate = req.params.todate;
    listRouter.salaryFunction.getmaxSalary(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});


//#endregion
//---------------------- employee's salary  ------------------------// end



//---------------------- addDeduct structure  ------------------------// begin
//#region 

// create addDeduct
router.post('/api/addDeduct/CRUD/C',(req,res,next) =>{
    listRouter.addDeductCRUD.createAddDeductStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update addDeduct
router.post('/api/addDeduct/CRUD/U',(req,res,next) =>{
    listRouter.addDeductCRUD.updateAddDeductStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete addDeduct
router.post('/api/addDeduct/CRUD/D',(req,res,next) =>{
    listRouter.addDeductCRUD.deleteAddDeductStruct(req).then(
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
router.post('/api/addDeduct/emp/CRUD/C',(req,res,next) =>{
    listRouter.addDeductCRUD.createEmployeeAddDeduct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's addDeduct
router.post('/api/addDeduct/emp/CRUD/U',(req,res,next) =>{
    listRouter.addDeductCRUD.updateEmployeeAddDeduct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's addDeduct
router.post('/api/addDeduct/emp/CRUD/D',(req,res,next) =>{
    listRouter.addDeductCRUD.deleteEmployeeAddDeduct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get max addDeduct

router.get('/api/addDeduct/function/getMaxaddDeduct/:todate/:adopt',authToken,(req,res,next) =>{
    const todate = req.params.todate, adopt = req.params.adopt;
    listRouter.addDeductFunction.getmaxaddDeduct(todate,adopt).then(
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
router.post('/api/payroll/CRUD/C',(req,res,next) =>{
    listRouter.payrollCRUD.createpayroll(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's payroll
router.post('/api/payroll/CRUD/U',(req,res,next) =>{
    listRouter.payrollCRUD.updatepayroll(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's payroll
router.post('/api/payroll/CRUD/D',(req,res,next) =>{
    listRouter.payrollCRUD.deletepayroll(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// call payroll

router.post('/api/payroll/function/cal/:yearid/:monthid',(req,res,next) =>{
    const yearid = req.params.yearid, monthid = req.params.monthid;
    listRouter.payrollFunction.callPayroll(monthid,yearid,'').then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get payroll

router.get('/api/payroll/function/get/:yearid/:monthid/:employeeid',(req,res,next) =>{

    const yearid = req.params.yearid,
          monthid = req.params.monthid,
          employeeid = req.params.employeeid;
    listRouter.payrollFunction.getPayroll(yearid,monthid,employeeid).then(
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
router.post('/api/para/CRUD/C',(req,res,next) =>{
    listRouter.parameterCRUD.createparameter(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update employee's payroll
router.post('/api/para/CRUD/U',(req,res,next) =>{
    listRouter.parameterCRUD.updateparameter(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete employee's payroll
router.post('/api/para/CRUD/D',(req,res,next) =>{
    listRouter.parameterCRUD.deleteparameter(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get list parameter

router.get('/api/para/function/get',(req,res,next) =>{

    listRouter.parameterFunction.getListparameter().then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});


//#endregion
//---------------------- parameter ------------------------// end



//---------------------- account ------------------------// begin
//#region 

// register account
router.post('/api/acc/CRUD/C',(req,res,next) =>{
    
    listRouter.accountCRUD.registerAccount(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update account
router.post('/api/acc/CRUD/U',authToken,(req,res,next) =>{
    
    listRouter.accountCRUD.updateAccount(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete account
router.post('/api/acc/CRUD/D',authToken,(req,res,next) =>{
    
    listRouter.accountCRUD.deleteAccount(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update password
router.post('/api/acc/pass/CRUD/U',authToken,(req,res,next) =>{

    listRouter.accountCRUD.updatePassword(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update access token
router.post('/api/acc/token/at/CRUD/U',(req,res,next) => {

    listRouter.accountCRUD.updateAccessToken(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// login
router.get('/api/acc/function/login/:accountId',(req,res,next) =>{
    // const body = {...req.body};
    const accountId = req.params.accountId;
    listRouter.accountFunction.login(accountId).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

//#endregion
//---------------------- account ------------------------// end



//---------------------- relation structure  ------------------------// begin
//#region 

// create relation structure
router.post('/api/relation/CRUD/C',(req,res,next) =>{
    listRouter.relationCRUD.createRelateStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update relation structure
router.post('/api/relation/CRUD/U',(req,res,next) =>{
    listRouter.relationCRUD.updateRelateStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete relation structure
router.post('/api/relation/CRUD/D',(req,res,next) =>{
    listRouter.relationCRUD.deleteRelateStruct(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

//#endregion
//---------------------- relation structure  ------------------------// end


//---------------------- family dependent  ------------------------// begin
//#region 

// create family dependent
router.post('/api/relation/emp/CRUD/C',(req,res,next) =>{
    listRouter.relationCRUD.createFamilyDepen(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// update family dependent
router.post('/api/relation/emp/CRUD/U',(req,res,next) =>{
    listRouter.relationCRUD.updateFamilyDepen(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// delete family dependent
router.post('/api/relation/emp/CRUD/D',(req,res,next) =>{
    listRouter.relationCRUD.deleteFamilyDepen(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get total depend family

router.get('/api/relation/function/getTotalDepend/:todate',(req,res,next) => {
    const todate = req.params.todate;
    listRouter.relationFunction.getmaxDepenFamily(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

// get detail depend family

router.get('/api/relation/function/get/:todate',(req,res,next) => {
    const todate = req.params.todate;
    listRouter.relationFunction.getDetailDepenFamily(todate).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
});

//#endregion


//---------------------- tblemp7h ------------------------------// begin
//#region 

// create tblemp7h

router.post('/api/emp7h/emp/CRUD/C',(req,res,next) => {
    listRouter.emp7hCRUD.createEmp7h(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    )
});

//#endregion
//---------------------- tblemp7h ------------------------------// end


//---------------------- role's structure  ------------------------// begin
//#region 

router.post('/api/roles/CRUD/C',(req,res,next) => {
    
    listRouter.roleCRUD.createRoleStructure(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})


//#endregion
//---------------------- role's structure  ------------------------// end


//---------------------- collection  ------------------------// begin
//#region 

// employee
router.post('/api/coll/tblemployee',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctEmployee().then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// position
router.post('/api/coll/tblpos',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctPos(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// department
router.post('/api/coll/tbldep',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctDep(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// emptype
router.post('/api/coll/tblemptype',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctEmpType(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// constract
router.post('/api/coll/tblempcontract',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctEmpContract(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// allowance
router.post('/api/coll/tblempallowance',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctEmpAllowance(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// allowance Fix
router.post('/api/coll/tblempallowancefix',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctEmpAllowanceFix(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// add / deduct
router.post('/api/coll/tblempad',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctEmpAD(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// basic salary
router.post('/api/coll/tblempsal',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctEmpSal(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// payroll
router.post('/api/coll/tblpayroll',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctEmpSal(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// parameter
router.post('/api/coll/tblpara',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctEmpSal(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// account
router.post('/api/coll/tblaccount',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctAccount(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// family
router.post('/api/coll/tblfamily',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctFamily(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// role
router.post('/api/coll/tblrole',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctRole(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

// total work days
router.post('/api/coll/tblwd',(req,res,next) => {
    
    listRouter.collectionCURD.createStuctRole(req).then(
        dataRespone => res.json(dataRespone)
    ).catch(
        err => next(err)
    );
})

//#endregion
//------------------------ collection  ------------------------// end

module.exports = router;