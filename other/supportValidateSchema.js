function getValidateSchema (tblname,...checkExists){
    let validateSchema = undefined;
    switch(tblname)
    {
        case "tblref_department":
            validateSchema = {
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
                            enum: checkExists[0],
                            description: "depParent must be string and must be in depId list"
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
            };
            break;
        case "tblempdep":
            validateSchema = {
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
                            enum: checkExists[0][0],
                            description: "secitonId must be string and need be in list depId on tblref_department structure table"
                        },
                        lineId:{
                            bsonType: ["null","string"],
                            maxLength: 50,
                            enum: checkExists[0][1],
                            description: "lineId must be string and need be in list depId on tblref_department structure table"
                        },
                        groupId:{
                            bsonType: ["null","string"],
                            maxLength: 50,
                            enum: checkExists[0][2],
                            description: "groupId must be string and need be in list depId on tblref_department structure table"
                        },
                        teamId:{
                            bsonType: ["null","string"],
                            maxLength: 50,
                            enum: checkExists[0][3],
                            description: "teamId must be string and need be in list depId on tblref_department structure table"
                        },
                        partId:{
                            bsonType: ["null","string"],
                            maxLength: 50,
                            enum: checkExists[0][4],
                            description: "partId must be string and need be in list depId on tblref_department structure table"
                        },
                        note:{
                            bsonType: ["null","string"],
                            maxLength: 250,
                            description: "note must be string "
                        },
                    }
                }
            };
            break;
        case "tblref_position":
            validateSchema = {
                $jsonSchema:{
                    bsonType:"object",
                    required:["posId","posName","note"],
                    properties:{
                        posId:{
                            bsonType:["string"],
                            maxLength:50,
                            description:"posId must be string"
                        },
                        posName:{
                            bsonType:["null","string"],
                            maxLength:250,
                            description:"posName must be string"
                        },
                        note:{
                            bsonType:["null","string"],
                            maxLength:250,
                            description:"note must be string"
                        }
                    }
                }
            };
            break;
        case "tblemppos":
            validateSchema = {
                $jsonSchema:{
                    bsonType:"object",
                    required:["employeeId","dateChange","posId","note"],
                    properties:{
                        employeeId:{
                            bsonType:"string",
                            minLength: 5,
                            maxLength: 30,
                            description:"employeeId must be string"
                        },
                        dateChange:{
                            bsonType:"date",
                            description:"dateChange must be date"
                        },
                        posId:{
                            bsonType:"string",
                            maxLength: 50,
                            enum: checkExists[0], // list position id validate
                            description:"posId must be string"
                        },
                        note:{
                            bsonType:["null","string"],
                            maxLength: 250,
                            description:"note must be string"
                        },
                    }
                }
            };
            break;

    }

    return validateSchema;
}

module.exports = getValidateSchema;