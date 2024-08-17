const connectString = require('../../databaseConnections/mongoDbConnection');
const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../other/supportFunction');
const status = require("../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;
const supportvalidateSchema = require('../../other/supportValidateSchema');
const dbName = 'humanproject';
const statusRequest = require('../../other/supportStatus').statusRequest;

/////////////////---------------- department structure -----------------------/////////////////////
//#region 

//----------------------------- create department structure --------------------------------// begin
//#region 
async function createDepartmentStruct(body)
{
     // create connection to mongodb
     const connect = await mongodb.connect(connectString);
     // collection name
     const collName = 'tblref_department'
           collNametblEmpDep = 'tblempdep';
     // get body json from req
     let dataClient = body.body;    
     // varible check real data ( exists in collection) or data from req
     let isrealDataExists = 0;
     if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
     const db = connect.db(dbName);
     const collTblRefdepartment = db.collection(collName);
     // check data if exists
     let checkExists = await collTblRefdepartment.find({}).project({_id:0,depId:1, depTypeId: 1, depParent: 1}).toArray();
     // varible hold original data from tblref_department and dont modify this varible ( we'll use later )
     const checkExistsForInsert = [...checkExists];
     // check if list department structure is not exists, we need to push data from req into array
     if(checkExists.length === 0) {
     // use data in req
        //checkExists = dataClient.map(ele => ele.depId); 
        checkExists = dataClient;
    }
     else{  
     // use data in tblref_department
        //checkExists = checkExists.map(ele => ele.depId);
     //  create varible called checkExistsFilter for filtering duplicate data if data in tblref_department which exists in req
        //let checkExistsFilter = dataClient.map(ele => ele.depId)
    const checkExistsForFilter = checkExists.map(ele => ele.depId);
    const checkExistsFilter = dataClient.filter(ele => (checkExistsForFilter.includes(ele.depId))? false: true);
     // concat data filtered to original data
     checkExists = checkExists.concat(checkExistsFilter);
    const 
        listTeamId = (checkExists.filter(ele => ele.depTypeId === 'T')).map(eleInner => ({depId: eleInner.depId, depParent: eleInner.depParent})),
        listGroupId = (checkExists.filter(ele => ele.depTypeId === 'G')).map(eleInner => ({depId: eleInner.depId, depParent: eleInner.depParent})),
        listLineId = (checkExists.filter(ele => ele.depTypeId === 'L')).map(eleInner => ({depId: eleInner.depId, depParent: eleInner.depParent})),
        listSectionId = (checkExists.filter(ele => ele.depTypeId === 'S' && ele.depParent === null)).map(eleInner => ({depId: eleInner.depId, depParent: eleInner.depParent}));
    
    checkExists = checkExists.filter(ele => {
        let matched = '';
        switch(ele.depTypeId)
        {
            case "L":
                matched = ((listSectionId.filter(eleInner => eleInner.depId === ele.depParent)).length === 1) ? 'S' : null;
                break;
            case "G":
                matched = ((listLineId.filter(eleInner => eleInner.depId === ele.depParent)).length === 1) ? 'L' : null;
                break;
            case "T":
                matched = ((listGroupId.filter(eleInner => eleInner.depId === ele.depParent)).length === 1) ? 'G' : null;
                break;
            case "P":
                matched = ((listTeamId.filter(eleInner => eleInner.depId === ele.depParent)).length === 1) ? 'T' : null;
                break;
        };
        if(matched || (ele.depParent === null && ele.depTypeId === 'S'))
        return ele;
        return false;

    });
     // mark isrealDataExists to 1 
        isrealDataExists = 1;
     }  
    //checkExists.push(null); // we need to push null value use for sectionId's deparent 

    // console.log(dataClientFilter);
    const checkExistsref_department = [...checkExists].map(ele => ele.depId);
    checkExistsref_department.push(null);

    //configure validate schema
    const validateSchema ={...supportvalidateSchema(collName,checkExistsref_department)}; 
    const setDepref = setDep;
    const sectionId = setDepref('S',checkExists),lineId = setDepref('L',checkExists),groupId = setDepref('G',checkExists),teamId = setDepref('T',checkExists),partId = setDepref('P',checkExists);
    // const validateSchemaTblempDep = {...supportvalidateSchema(collNametblEmpDep,[sectionId,lineId,groupId,teamId,partId])}
    // try {
    //     await db.createCollection(collNametblEmpDep,{
    //         validator: validateSchemaTblempDep
    //     });
    // } catch (error) {
    //     await db.command({
    //         collMod: collNametblEmpDep,
    //         validator: validateSchemaTblempDep
    //     })
    // }
    // try {
    //     // create collection if not exists with validate schema
    //     await db.createCollection(collName,{
    //         validator: validateSchema
    //     })
    // } catch (error) {
    //     // if collection has already existed in db and validate schema was changed, we need to update validate 
    //     await db.command({
    //         collMod: collName,
    //         validator: validateSchema
    //     })
    // }
    try {
   
    //collTblRefdepartment.createIndex({depId: 1});
    
    // when some data has already existed in collection then we need to filter the data which not exists in collection
    let dataClientFilter = [...checkExists];
    
    if(isrealDataExists !== 0)
    {
        dataClientFilter = dataClientFilter.filter((ele) => (checkExistsForInsert.map(ele => ele.depId).includes(ele.depId))? false : true);
    }

    // return status 0 row if length === 0 (nothing to do)
    if(dataClientFilter.length === 0) return status(0,0);
    // format data before insert data
    dataClientFilter = dataClientFilter.reduce((value,current) => {
        value.push({
            'depId' : current.depId,
            'depName': current.depName,
            'depTypeId': current.depTypeId,
            'depParent': current.depParent,
            'depNo': Number((!current.depNo) ? 0 : current.depNo),
            'note': current.note
        })
        return value;
    },[]);
    const listDepartmentStructure = await collTblRefdepartment.insertMany(dataClientFilter);
    return listDepartmentStructure;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- create department structure --------------------------------// end

//----------------------------- update department structure --------------------------------// begin
//#region 
async function updateDepartmentStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblref_department = 'tblref_department';
    const tblempdep = 'tblempdep';
    const collTblRefdepartment = db.collection(tblref_department);
    const collTblempDep = db.collection(tblempdep);
    try {
    const dataClient = body.body;
    let totalRowsAffect = 0;    
    let listExistsTblempDep = await collTblempDep.find({}).project({_id:0,
        sectionId:1,
        lineId:1,
        groupId:1,
        teamId:1,
        partId:1}).toArray();
    let listExistsTblref_department = await collTblRefdepartment.find({}).project({_id:0, depId:1, depTypeId: 1}).toArray();

    let mapListDep = new Set();
    for(let ele of listExistsTblempDep)
    {
        mapListDep.add(ele.sectionId);
        mapListDep.add(ele.lineId);
        mapListDep.add(ele.groupId);
        mapListDep.add(ele.teamId);
        mapListDep.add(ele.partId);
    }
    mapListDep = Array.from(mapListDep.values()).filter(ele => ele !== null);

    if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
    const dataClientTypeIdFilter = dataClient.filter(ele => {
        let depTypeId = listExistsTblref_department.filter(eleInner => eleInner.depId === ele.depParent).map(ele => ele.depTypeId)[0];
        depTypeId = (depTypeId === 'T')? 'P' : (depTypeId === 'G')? 'T' : (depTypeId === 'L')? 'G' : (depTypeId === 'S')? 'L' : null;
        return ((depTypeId === ele.depTypeId) || (depTypeId === null && ele.depParent === null && ele.depTypeId === 'S'))? ele : false;
    });

    const dataClientFilter= [...dataClientTypeIdFilter].filter(ele => (mapListDep.some(eleInner => eleInner === ele.depId)));
    const dataClientNotFilter = [...dataClientTypeIdFilter].filter(ele => (mapListDep.some(eleInner => eleInner === ele.depId)? false: true));

    for(let current of dataClientFilter)
    {
     const filter = {'depId' : current.depId};
     const listDataUpdate = 
        {   
        $set:{
            'depName': current.depName,
            //'depTypeId': current.depTypeId,
            //'depParent': current.depParent,
            'depNo': Number(current.depNo),
            'note': current.note
        }
        };
     const respone = await collTblRefdepartment.updateOne(filter,listDataUpdate);  
    totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;  
    }
    for(let current of dataClientNotFilter)
    {

     const filter = {'depId' : current.depId};
     const listDataUpdate = 
        {   
        $set:{
            'depName': current.depName,
            'depTypeId': current.depTypeId,
            'depParent': current.depParent,
            'depNo': Number(current.depNo),
            'note': current.note
        }
        };
     const respone = await collTblRefdepartment.updateOne(filter,listDataUpdate);  
     totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;  
    }

    let listdepartmentforValidate = [...listExistsTblref_department].filter(ele => (dataClientTypeIdFilter.map(eleInner => eleInner.depId)).includes(ele.depId)? false : true );
    listdepartmentforValidate = (listdepartmentforValidate.concat(dataClientTypeIdFilter)).filter(ele => ([...listExistsTblref_department].map(eleInner => eleInner.depId)).includes(ele.depId));
    const listdepartmentforValidateEmpdep = [...listdepartmentforValidate];
    listdepartmentforValidate = listdepartmentforValidate.map(ele => ele.depId)
    // console.log(listdepartmentforValidate);
    listdepartmentforValidate.push(null);
    const updateSchemaref_department = {...supportvalidateSchema(tblref_department,listdepartmentforValidate)};
    const setDepempdep = setDep;
   
    const sectionId = setDepempdep('S',listdepartmentforValidateEmpdep),lineId = setDepempdep('L',listdepartmentforValidateEmpdep),groupId = setDepempdep('G',listdepartmentforValidateEmpdep),teamId = setDepempdep('T',listdepartmentforValidateEmpdep),partId = setDepempdep('P',listdepartmentforValidateEmpdep);
    const updateSchemaTblempDep = {...supportvalidateSchema(tblempdep,[sectionId,lineId,groupId,teamId,partId])};

    // await db.command({
    //     collMod: tblref_department,
    //     validator: updateSchemaref_department
    // });
    // await db.command({
    //     collMod: tblempdep,
    //     validator: updateSchemaTblempDep
    // })
    
    return status(totalRowsAffect,1);
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- update department structure --------------------------------// end

//----------------------------- delete department structure --------------------------------// begin
//#region 
async function deleteDepartmentStruct(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const collName = "tblref_department";
    const collEmpDep = "tblempdep";
    const collTblRefdepartment = db.collection(collName);
    const collTblempDep = db.collection(collEmpDep);
    try {
    let dataClient = body.body;
    let totalRowsAffect = 0;
    let listExistsTblempDep = await collTblempDep.find({}).project({_id:0,
        sectionId:1,
        lineId:1,
        groupId:1,
        teamId:1,
        partId:1}).toArray();
    // old map
    //#region 
    // const mapSection = new Map(),
    //       mapLine = new Map(),
    //       mapGroup = new Map(),
    //       mapTeam = new Map(),
    //       mapPart = new Map();

    // for(let ele of listExistsTblempDep)
    // {
    //     mapSection.set(ele.sectionId,(mapSection.get(ele.sectionId) || 0) + 1);
    //     mapLine.set(ele.lineId,(mapLine.get(ele.lineId) || 0) + 1);
    //     mapGroup.set(ele.groupId,(mapGroup.get(ele.groupId) || 0) + 1); 
    //     mapTeam.set(ele.teamId,(mapTeam.get(ele.teamId) || 0) + 1);
    //     mapPart.set(ele.partId,(mapPart.get(ele.partId) || 0) + 1);
    // }
    // listExistsTblempDep = (Array.from(mapSection.keys()).concat(Array.from(mapLine.keys())).concat(Array.from(mapGroup.keys())).concat(Array.from(mapTeam.keys())).concat(Array.from(mapPart.keys()))).filter(ele => ele !== null);
    //#endregion
    
    let mapListDep = new Set();
    for(let ele of listExistsTblempDep)
    {
        mapListDep.add(ele.sectionId);
        mapListDep.add(ele.lineId);
        mapListDep.add(ele.groupId);
        mapListDep.add(ele.teamId);
        mapListDep.add(ele.partId);
    }
    mapListDep = Array.from(mapListDep.values()).filter(ele => ele !== null);
    //console.log(mapListDep);
    
    if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
    let dataClientFilter = dataClient.filter(ele => (mapListDep.some(eleInner => eleInner === ele.depId))? false: true );
    const getTblref_department = await collTblRefdepartment.find({}).project({_id:0, depId:1, depTypeId: 1,depParent : 1 }).toArray();
    // can not remove depId which belong to deparent of other department
    dataClientFilter = dataClientFilter.filter(ele => ([...getTblref_department].map(ele => ele.depParent)).includes(ele.depId)? false : true );

    if(dataClientFilter.length === 0) return status(0,2); 
    for(let ele of dataClientFilter) 
    {
        const dataForDelete = {
            depId: ele.depId
        }
        const respone = await collTblRefdepartment.deleteOne(dataForDelete);
        totalRowsAffect += (respone.deletedCount === 1)? 1 :0 ;
    }

    const mapdataref = ([...getTblref_department].filter(ele => dataClientFilter.includes(ele.depId)? false : true )).map(ele => ele.depId);
    const updateSchema = {...supportvalidateSchema(collName,mapdataref)};
    const setDepempdep = setDep;
    const mapdataempdep = [...getTblref_department].filter(ele => dataClientFilter.includes(ele.depId)? false : true );
    const sectionId = setDepempdep('S',mapdataempdep),lineId = setDepempdep('L',mapdataempdep),groupId = setDepempdep('G',mapdataempdep),teamId = setDepempdep('T',mapdataempdep),partId = setDepempdep('P',mapdataempdep);
    const updateSchemaTblempDep = {...supportvalidateSchema(collEmpDep,[sectionId,lineId,groupId,teamId,partId])};

    // await db.command({
    //     collMod: collName,
    //     validator: updateSchema
    // });
    // await db.command({
    //     collMod: collEmpDep,
    //     validator: updateSchemaTblempDep
    // })
    return status(totalRowsAffect,2);

    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
//#endregion
//----------------------------- delete department structure  --------------------------------// end
//#endregion



/////////////////---------------- employee's department -----------------------/////////////////////
//#region 

//----------------------------- create employee's department --------------------------------// begin
//#region 
async function createEmployeeDepartment(body)
{
    const connect = await mongodb.connect(connectString);
    const collName = 'tblempdep';
    const db = connect.db(dbName);
    const collEmpDep = db.collection(collName),
          collref_dep = db.collection('tblref_department'),
          collEmployee = db.collection('tblemployee');
    const checkExistsDepId = (await collref_dep.find({}).project({_id:0, depId:1,depTypeId:1, depParent: 1}).toArray()).map(ele => ({depId: ele.depId, depTypeId: ele.depTypeId, depParent: ele.depParent}));

    const setDepempdep = setDep;
    const sectionId = setDepempdep('S',checkExistsDepId),lineId = setDepempdep('L',checkExistsDepId),groupId = setDepempdep('G',checkExistsDepId),teamId = setDepempdep('T',checkExistsDepId),partId = setDepempdep('P',checkExistsDepId);

    const validateSchema = {...supportvalidateSchema(collName,[sectionId,lineId,groupId,teamId,partId])};
    // try {
    // await db.createCollection(collName,{
    //     validator: validateSchema
    // });
    // } catch (error) {
    //     await db.command({
    //         collMod: collName,
    //         validator: validateSchema
    //     });
    // }
    try {
    // create index if not exists
    //await collEmpDep.createIndexes([{ key: {employeeId: 1, dateChange: -1}, name: "idx_employeeId_dateChange"},{key:{dateChange: -1},name:"idx_dateChange"}]);
    
    let dataClient = body.body;    
    if(!dataClient instanceof Array) throw statusRequest(0).message;
    // check data if exists
    const checkExistsEmpdep = await collEmpDep.find({}).toArray();
    const checkExistsEmployee = await collEmployee.find().project({employeeId:1}).toArray();
    //const listDepIdInDB = await collref_dep.find().project({_id:0,depId:1}).toArray();
    dataClientFilter = dataClient.filter((ele) => (checkExistsEmpdep.some(
        eleInner => eleInner.employeeId === ele.employeeId && functionSupport.castDate(eleInner.dateChange,1) === functionSupport.castDate(ele.dateChange,1)
        ))? false : true);
    dataClientFilter = dataClientFilter.filter(ele => checkExistsEmployee.some(eleInner => ele.employeeId === eleInner.employeeId));
    
    // validate deparents
    dataClientFilter = checkValidDep(checkExistsDepId,dataClientFilter);

    //console.log(dataClient);
    //old validate depid
    //#region 
    // listDataForInsert = listDataForInsert.filter(ele => {

    //         let isNotMatched = 0;
    //         let listDep = ['sectionId','lineId','groupId','teamId','partId'];
    //         for(let i = 0 ; i < 5 ; ++i)
    //         {
    //             if(listDepIdInDB.some(eleDep => (ele[listDep[i]] === null) ? true : ele[listDep[i]] === eleDep.depId) === false)
    //             isNotMatched = 1;   
    //         }
    //         return (isNotMatched === 0)? true: false;
    // });
    //#endregion
    
    if(dataClientFilter.length === 0) return status(0,0);
    dataClientFilter = dataClientFilter.reduce((value,current) => {
        value.push({
            'employeeId': current.employeeId,
            'dateChange': functionSupport.castDate(current.dateChange,0),
            'sectionId': current.sectionId,
            'lineId': current.lineId,
            'groupId': current.groupId,
            'teamId': current.teamId,
            'partId': current.partId,
            'note': current.note
        })
        return value;
    },[]);
    const listEmployeeDepartment = await collEmpDep.insertMany(dataClientFilter);
    return listEmployeeDepartment;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        connect.close();
    }
}
//#endregion
//----------------------------- create employee's department --------------------------------// end

//----------------------------- update employee's department --------------------------------// begin
//#region 
async function updateEmployeeDepartment(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const collref_dep = db.collection('tblref_department');
    try {
    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw statusRequest(0).message;
    const listDepIdInDB = await collref_dep.find({}).project({_id:0,depId:1, depTypeId: 1, depParent: 1}).toArray();
    
    // validate deparents
    const dataClientFilter = checkValidDep(listDepIdInDB,dataClient);
  
    let totalRowsAffect = 0;    
    for(let current of dataClientFilter)
    {
     const filter = {'_id' : new objectIdmg(current._id)};
     const listDataUpdate = 
        {   
        $set:{
            'dateChange': functionSupport.castDate(current.dateChange,0),
            'sectionId': current.sectionId,
            'lineId': current.lineId,
            'groupId': current.groupId,
            'teamId': current.teamId,
            'partId': current.partId,
            'note': current.note
        }
        };
    const respone = await db.collection('tblempdep').updateOne(filter,listDataUpdate);
    totalRowsAffect += (respone.modifiedCount === 1)? 1 : 0;
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
//----------------------------- update employee's department --------------------------------// end

//----------------------------- delete employee's department --------------------------------// begin
//#region 
async function deleteEmployeeDepartment(body)
{
    const connect = await mongodb.connect(connectString);
    try {
    const dataClient = body.body;
    let totalRowsAffect = dataClient.length;
    if(!dataClient instanceof Array) throw statusRequest(0).message;
    for(let ele of dataClient)
    {
        const dataForDelete = {
            _id: new objectIdmg(ele._id)
        }
        const respone = await connect.db(dbName).collection('tblempdep').deleteOne(dataForDelete);
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
//----------------------------- delete employee's department  --------------------------------// end


//#endregion


function setDep(depTypeId,listArrayFilter)
    {
        const result = listArrayFilter.filter(ele => ele.depTypeId === depTypeId).map(eleInner => eleInner.depId);
        if(depTypeId !== 'S')
        result.push(null);
        return result;
    }

function checkValidDep(checkExistsDepId,dataClient)
{
    // validate deparents
    // filter list department for each depTypeId
    const listPartId = (checkExistsDepId.filter(ele => ele.depTypeId === 'P')).map(eleInner => ({depId: eleInner.depId, depParent: eleInner.depParent})),
        listTeamId = (checkExistsDepId.filter(ele => ele.depTypeId === 'T')).map(eleInner => ({depId: eleInner.depId, depParent: eleInner.depParent})),
        listGroupId = (checkExistsDepId.filter(ele => ele.depTypeId === 'G')).map(eleInner => ({depId: eleInner.depId, depParent: eleInner.depParent})),
        listLineId = (checkExistsDepId.filter(ele => ele.depTypeId === 'L')).map(eleInner => ({depId: eleInner.depId, depParent: eleInner.depParent}))
        //listSectionId = (checkExistsDepId.filter(ele => ele.depTypeId === 'S')).map(eleInner => ({depId: eleInner.depId, depParent: eleInner.depParent}));
        //console.log(listSectionId);
    // isnull function
    const isnull = supportFunction.isnull;
    const dataClientFilter = dataClient.filter(ele => {
        //find level of department
        const depLevel = (ele.partId)? 5 :  (ele.teamId)? 4 : (ele.groupId)? 3 : (ele.lineId)? 2 : 1;
        //console.log(`department level: ${depLevel}`);
        //find parent of department => then map to an Array
        //if user input valid department id, we can find true parent of department id, else the parent of department id is empty
        const lineParent = (listLineId.filter(eleInner => eleInner.depId === ele.lineId)).map(ele => ele.depParent),
        groupParent = (listGroupId.filter(eleInner => eleInner.depId === ele.groupId)).map(ele => ele.depParent),
        teamarent = (listTeamId.filter(eleInner => eleInner.depId === ele.teamId)).map(ele => ele.depParent),
        partParent = (listPartId.filter(eleInner => eleInner.depId === ele.partId)).map(ele => ele.depParent);

        let isCorrectPartId = (!ele.partId) ? null : ( partParent !== '') ? partParent : null;
        let isCorrectTeamId = (!ele.teamId) ? null : ( teamarent !== '') ? teamarent : null;
        let isCorrectGroupId = (!ele.groupId) ? null : ( groupParent !== '') ? groupParent : null;
        let isCorrectLineId = (!ele.lineId) ? null : ( lineParent !== '') ? lineParent : null;
        
        // if level of department < 5 then we need to update missing part
        switch(depLevel){
            case 5:
                 break;
            case 4:
                 isCorrectPartId = ele.teamId;
                 break;
            case 3:
                 isCorrectTeamId = ele.groupId;
                break;
            case 2:
                 isCorrectGroupId = ele.lineId;
                break;
            case 1:
                 isCorrectLineId = ele.sectionId;
                break;
        }
        //test
        //#region 
        // console.log(`sectionId:\nlineId: ${isCorrectLineId}\ngroupId: ${isCorrectGroupId}\nteamId: ${isCorrectTeamId}\npartId: ${isCorrectPartId}`);
        // console.log(`sectionId:\nlineId: ${ ele.sectionId}\ngroupId: ${ele.lineId}\nteamId: ${ele.groupId}\npartId: ${ele.teamId}`);
        //const isCorrectSectionId = (!ele.sectionId) ? null : ((listSectionId.filter(eleInner => eleInner.depId === ele.sectionId)).map(ele => ele.depParent) !== '') ?  (listSectionId.filter(eleInner => eleInner.depId === ele.sectionId)).map(ele => ele.depParent) : null;
        //#endregion
        // match department id for filtering data
        if( isnull(isCorrectLineId,'x') === isnull(ele.sectionId,'x') && isnull(isCorrectGroupId,'x') === isnull(ele.lineId,'x') && isnull(isCorrectTeamId,'x') === isnull(ele.groupId,'x') && isnull(isCorrectPartId,'x') === isnull(ele.teamId,'x') )
        return ele;
        return false;
    });
    return dataClientFilter;
}

module.exports = {
    //--------------department structure---------------//
    createDepartmentStruct: createDepartmentStruct,
    updateDepartmentStruct: updateDepartmentStruct,
    deleteDepartmentStruct: deleteDepartmentStruct,

    //--------------employee's department--------------//
    createEmployeeDepartment: createEmployeeDepartment,
    updateEmployeeDepartment: updateEmployeeDepartment,
    deleteEmployeeDepartment: deleteEmployeeDepartment
};