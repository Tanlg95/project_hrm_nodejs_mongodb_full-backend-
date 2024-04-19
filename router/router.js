const express = require('express');
const router = express.Router();
const employeeCRUD = require('../databaseOperations/masterData/employeeCRUD');
const departmentCRUD = require('../databaseOperations/department/departmentCRUD');
const departmentFunction = require('../databaseOperations/department/departmentFunction');
const positionCRUD = require('../databaseOperations/position/positionCRUD');

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

//#endregion
//---------------------- employee's position  ------------------------// end

module.exports = router;