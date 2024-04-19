const connectString = require('../../databaseConnections/mongoDbConnection');
const supportFunction = require('../../other/supportFunction');
const mongodb = require('mongodb').MongoClient;
const functionSupport = require('../../other/supportFunction');
const status = require("../../other/supportStatus").status;
const objectIdmg = require('mongodb').ObjectId;

/////////////////---------------- department structure -----------------------/////////////////////
//#region 

//----------------------------- create department structure --------------------------------// begin
//#region 
async function createDepartmentStruct(body)
{
     const connect = await mongodb.connect(connectString);
     const dataClient = body.body;    
     let isrealDataExists = 0;
     if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
     const coll = connect.db('humanproject').collection('tblref_department');
     // check data if exists
     let checkExists = await coll.find({}).project({_id:0,depId:1}).toArray();
     const checkExistsForInsert = [...checkExists].map(ele => ele.depId);
     // check if list department structure is not exists, we need to push some default value into array
     if(checkExists.length === 0) {
        checkExists = dataClient.map(ele => ele.depId);
        checkExists.push(null);
     }
     else{
        
        checkExists = checkExists.map(ele => ele.depId);
        let checkExistsFilter = dataClient.map(ele => ele.depId)
        checkExistsFilter = checkExistsFilter.filter(ele => (checkExists.includes(ele) === true)? false: true);
        checkExists = checkExists.concat(checkExistsFilter);
        checkExists.push(null);
        isrealDataExists = 1;
    }  
    try {
        
        await connect.db('humanproject').createCollection('tblref_department',{
            validator:{
                $jsonSchema:{
                    bsonType:"object",  
                    required:["depId","depName","depTypeId","depParent","depNo","note"],
                    properties:{
                        depId:{
                            bsonType: "string",
                            maxLength: 50,
                            description: "depId must be string"
                        },
                        depName:{
                            bsonType: 'string',
                            maxLength: 250,
                            description: "depName must be string",
                        },
                        depTypeId:{
                            bsonType: "string",
                            maxLength: 1,
                            enum:['S','L','G','T','P'],
                            description: "depTypeId must be string and in [S,L,G,T,P]"
                        },
                        depParent: {
                            bsonType: ["null","string"],
                            maxLength: 50,
                            enum: checkExists,
                            description: "depParent must be string and must in depId list"
                        },
                        depNo:{
                            bsonType: ["null","int"],
                            description: "depNo use for sorting data"
                        },
                        note:{
                            bsonType: ["null","string"],
                            description:"note must be string"
                        }
                    }
                }
            }
            
        })
    } catch (error) {
        await connect.db('humanproject').command({
            collMod: "tblref_department",
            validator:{
                $jsonSchema:{
                    bsonType:"object",
                    required:["depId","depName","depTypeId","depParent","depNo","note"],
                    properties:{
                        depId:{
                            bsonType: "string",
                            maxLength: 50,
                            description: "depId must be string"
                        },
                        depName:{
                            bsonType: 'string',
                            maxLength: 250,
                            description: "depName must be string",
                        },
                        depTypeId:{
                            bsonType: "string",
                            maxLength: 1,
                            enum:['S','L','G','T','P'],
                            description: "depTypeId must be string and in [S,L,G,T,P]"
                        },
                        depParent: {
                            bsonType: ["null","string"],
                            maxLength: 50,
                            enum: checkExists,
                            description: "depParent must be string and must in depId list"
                        },
                        depNo:{
                            bsonType: ["null","int"],
                            description: "depNo use for sorting data"
                        },
                        note:{
                            bsonType: ["null","string"],
                            description:"note must be string"
                        }
                    }
                }
            }
        })
    }
    try {
    checkExists.pop();
    let listDataForInsert = dataClient;
    // when some data has already existed in collection then we need to filter the data which not exists in collection
    if(isrealDataExists !== 0)
    {
        listDataForInsert = dataClient.filter((ele) => (checkExistsForInsert.includes(ele.depId))? false : true);
    }

    if(listDataForInsert.length === 0) return status(0,0);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
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
    const listDepartmentStructure = await coll.insertMany(dataForInsert);
    return listDepartmentStructure;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        connect.close();
    }
}
//#endregion
//----------------------------- create department structure --------------------------------// end

//----------------------------- update department structure --------------------------------// begin
//#region 
async function updateDepartmentStruct(body)
{
    const connect = await mongodb.connect(connectString);
    try {
    const dataClient = body.body;
    let totalRowsAffect = body.body.length;    
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    for(let current of dataClient)
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
    const respone = await connect.db('humanproject').collection('tblref_department').updateOne(filter,listDataUpdate);
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
//----------------------------- update department structure --------------------------------// end

//----------------------------- delete department structure --------------------------------// begin
//#region 
async function deleteDepartmentStruct(body)
{
    const connect = await mongodb.connect(connectString);
    try {
    const dataClient = body.body;
    let totalRowsAffect = dataClient.length;
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    for(let ele of dataClient)
    {
        const dataForDelete = {
            depId: ele.depId
        }
        const respone = await connect.db('humanproject').collection('tblref_department').deleteOne(dataForDelete);
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
//----------------------------- delete department structure  --------------------------------// end
//#endregion



/////////////////---------------- employee's department -----------------------/////////////////////
//#region 

//----------------------------- create employee's department --------------------------------// begin
//#region 
async function createEmployeeDepartment(body)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db('humanproject');
    const collEmpDep = db.collection('tblempdep'),
          collref_dep = db.collection('tblref_department'),
          collEmployee = db.collection('tblemployee');
    const checkExistsDepId = (await collref_dep.find({}).project({_id:0, depId:1}).toArray()).map(ele => ele.depId);
    try {
    checkExistsDepId.push(null);
    await db.createCollection('tblempdep',{
        validator:{
            $jsonSchema:{
                bsonType:"object",
                required:["employeeId","dateChange","sectionId","lineId","groupId","teamId","partId","note"],
                properties:{
                    employeeId:{
                        bsonType: "string",
                        minLength: 5,
                        maxLength: 30,
                        description:"employeeId must be string"
                    },
                    dateChange:{
                        bsonType: "date",
                        description:"dateChange must be date"
                    },
                    sectionId:{
                        bsonType: "string",
                        maxLength: 50,
                        enum: checkExistsDepId,
                        description: "secitonId must be string and need be in list depId on tblref_department structure table"
                    },
                    lineId:{
                        bsonType: ["null","string"],
                        maxLength: 50,
                        enum: checkExistsDepId,
                        description: "lineId must be string and need be in list depId on tblref_department structure table"
                    },
                    groupId:{
                        bsonType: ["null","string"],
                        maxLength: 50,
                        enum: checkExistsDepId,
                        description: "groupId must be string and need be in list depId on tblref_department structure table"
                    },
                    teamId:{
                        bsonType: ["null","string"],
                        maxLength: 50,
                        enum: checkExistsDepId,
                        description: "teamId must be string and need be in list depId on tblref_department structure table"
                    },
                    partId:{
                        bsonType: ["null","string"],
                        maxLength: 50,
                        enum: checkExistsDepId,
                        description: "partId must be string and need be in list depId on tblref_department structure table"
                    },
                    note:{
                        bsonType: ["null","string"],
                        maxLength: 250,
                        description: "note must be string "
                    },
                }
            }
        }
    });
    } catch (error) {
        await db.command({
            collMod:"tblempdep",
            validator:{
                $jsonSchema:{
                    bsonType:"object",
                    required:["employeeId","dateChange","sectionId","lineId","groupId","teamId","partId"],
                    properties:{
                        employeeId:{
                            bsonType: "string",
                            minLength: 5,
                            maxLength: 30,
                            description:"employeeId must be string"
                        },
                        dateChange:{
                            bsonType: "date",
                            description:"dateChange must be date"
                        },
                        sectionId:{
                            bsonType: "string",
                            maxLength: 50,
                            enum: checkExistsDepId,
                            description: "secitonId must be string and need be in list depId on tblref_department structure table"
                        },
                        lineId:{
                            bsonType: ["null","string"],
                            maxLength: 50,
                            enum: checkExistsDepId,
                            description: "lineId must be string and need be in list depId on tblref_department structure table"
                        },
                        groupId:{
                            bsonType: ["null","string"],
                            maxLength: 50,
                            enum: checkExistsDepId,
                            description: "groupId must be string and need be in list depId on tblref_department structure table"
                        },
                        teamId:{
                            bsonType: ["null","string"],
                            maxLength: 50,
                            enum: checkExistsDepId,
                            description: "teamId must be string and need be in list depId on tblref_department structure table"
                        },
                        partId:{
                            bsonType: ["null","string"],
                            maxLength: 50,
                            enum: checkExistsDepId,
                            description: "partId must be string and need be in list depId on tblref_department structure table"
                        },
                        note:{
                            bsonType: ["null","string"],
                            maxLength: 250,
                            description: "note must be string "
                        },
                    }
                }
            }
        });
    }
    try {
    // create index if not exists
    await collEmpDep.createIndexes([{ key: {employeeId: 1, dateChange: -1}, name: "idx_employeeId_dateChange"},{key:{dateChange: -1},name:"idx_dateChange"}]);
    
    const dataClient = body.body;    
    if(!dataClient instanceof Array) throw new Error(`data must be an array!!!!`);
    // check data if exists
    const checkExists = await collEmpDep.find({}).toArray();
    const listEmployeeIdInDB = await collEmployee.find().project({employeeId:1}).toArray();
    //const listDepIdInDB = await collref_dep.find().project({_id:0,depId:1}).toArray();
    let listDataForInsert = dataClient.filter((ele) => (checkExists.some(
        eleInner => eleInner.employeeId === ele.employeeId && functionSupport.castDate(eleInner.dateChange,1) === functionSupport.castDate(ele.dateChange,1)
        ) === true)? false : true);
    listDataForInsert = listDataForInsert.filter(ele => listEmployeeIdInDB.some(eleInner => ele.employeeId === eleInner.employeeId));
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
    if(listDataForInsert.length === 0) return status(0,0);
    const dataForInsert = listDataForInsert.reduce((value,current) => {
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
    const listEmployeeDepartment = await collEmpDep.insertMany(dataForInsert);
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
    try {
    const dataClient = body.body;
    if(!(dataClient  instanceof Array)) throw new Error(`data must be an array!!!!`);
    const listDepIdInDB = await connect.db('humanproject').collection('tblref_department').find().project({_id:0,depId:1}).toArray();
    const dataClientFilter = dataClient.filter(ele => {
        let isNotMatched = 0;
        let listDep = ['sectionId','lineId','groupId','teamId','partId'];
        for(let i = 0 ; i < 5 ; ++i)
        {
            if(listDepIdInDB.some(eleDep => (ele[listDep[i]] === null) ? true : ele[listDep[i]] === eleDep.depId) === false)
            isNotMatched = 1;   
        }
        return (isNotMatched === 0)? true: false;
    });
    let totalRowsAffect = dataClientFilter.length;    
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
    const respone = await connect.db('humanproject').collection('tblempdep').updateOne(filter,listDataUpdate);
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
//----------------------------- update employee's department --------------------------------// end

//----------------------------- delete employee's department --------------------------------// begin
//#region 
async function deleteEmployeeDepartment(body)
{
    const connect = await mongodb.connect(connectString);
    try {
    const dataClient = body.body;
    let totalRowsAffect = dataClient.length;
    if(!dataClient instanceof Array) throw new Error(`data must be an array!!!!`);
    for(let ele of dataClient)
    {
        const dataForDelete = {
            _id: new objectIdmg(ele._id)
        }
        const respone = await connect.db('humanproject').collection('tblempdep').deleteOne(dataForDelete);
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