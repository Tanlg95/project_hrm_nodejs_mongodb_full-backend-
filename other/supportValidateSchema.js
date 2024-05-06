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
        case "tblref_contractType":
            validateSchema = {
                $jsonSchema:{
                    bsonType:"object",
                    required:["contractTypeId","contractTypeName","month","note"],
                    properties:{
                        contractTypeId:{
                            bsonType:"string",
                            minLength: 2,
                            maxLength: 30,
                            description:"contractTypeId must be string"
                        },
                        contractTypeName:{
                            bsonType:"string",
                            maxLength: 250,
                            description:"contractTypeName must be date"
                        },
                        month:{
                            bsonType:["null","int"],
                            //minimum: 2,
                            description:"month must be int"
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
        case "tblempContract":
            validateSchema = {
                $jsonSchema:{
                    bsonType:"object",
                    required:["employeeId","fromdate","todate","contractTypeId","note"],
                    properties:{
                        employeeId:{
                            bsonType: "string",
                            minLength: 5,
                            maxLength: 30,
                            description:"employeeId must be string"
                        },
                        fromdate:{
                            bsonType: "date",
                            description:"fromdate must be date"
                        },
                        todate:{
                            bsonType: ["null","date"],
                            description:"todate must be date"
                        },
                        contractTypeId:{
                            bsonType: "string",
                            enum: checkExists[0],
                            description:"note must be string"
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
        case "tblref_empType":
            validateSchema = {
                $jsonSchema:{
                    bsonType: "object",
                    required: ["empTypeId","empTypeName","note"],
                    properties:{
                        empTypeId:{
                            bsonType: "string",
                            minLength: 2,
                            maxLength: 30,
                            description: "empTypeId must be string"
                        },
                        empTypeName:{
                            bsonType: "string",
                            maxLength: 150,
                            description: "empTypeName must be string"
                        },
                        note:{
                            bsonType: ["null","string"],
                            maxLength: 250,
                            description: "note must be string"
                        },
                    }
                }
            };
            break;
        case "tblempType":
            validateSchema = {
                $jsonSchema:{
                    bsonType: "object",
                    required: ["employeeId","dateChange","empTypeId","note"],
                    properties:{
                        employeeId:{
                            bsonType: "string",
                            minLength: 5,
                            maxLength: 30,
                            description:"employeeId must be string"
                        },
                        dateChange:{
                            bsonType:"date",
                            description:"dateChange must be date"
                        },
                        empTypeId:{
                            bsonType: "string",
                            minLength: 2,
                            maxLength: 30,
                            enum: checkExists[0],
                            description: "empTypeId must be string"
                        },
                        note:{
                            bsonType: ["null","string"],
                            maxLength: 250,
                            description: "note must be string"
                        },
                    }
                }
            }
            break;
        case "tblemployee":
            validateSchema = {
                $jsonSchema: {
                    bsonType: 'object',
                    required: [
                      'employeeId',
                      'employeeName',
                      'birthDate',
                      'employedDate',
                      'leftDate',
                      'sex',
                      'address',
                      'cellphone',
                      'idcard',
                      'email',
                      'degreeId',
                      'ReligionId',
                      'MaritalStatus'
                    ],
                    properties: {
                      employeeId: {
                        bsonType: [
                          'null',
                          'string'
                        ],
                        minLength: 5,
                        maxLength: 30,
                        description: 'employeeId must be string'
                      },
                      employeeName: {
                        bsonType: [
                          'null',
                          'string'
                        ],
                        minLength: 1,
                        maxLength: 150,
                        description: 'employeeName must be string'
                      },
                      birthDate: {
                        bsonType: [
                          'null',
                          'date'
                        ],
                        description: 'birthDate must be date'
                      },
                      employedDate: {
                        bsonType: [
                          'null',
                          'date'
                        ],
                        description: 'employedDate must be date'
                      },
                      leftDate: {
                        bsonType: [
                          'null',
                          'date'
                        ],
                        description: 'leftDate must be date'
                      },
                      sex: {
                        bsonType: [
                          'null',
                          'string'
                        ],
                        'enum': [
                          'male',
                          'female'
                        ],
                        description: 'sex must be string and in(\'male\',\'female\')'
                      },
                      address: {
                        bsonType: [
                          'null',
                          'string'
                        ],
                        minLength: 1,
                        maxLength: 250,
                        description: 'address must be string'
                      },
                      cellphone: {
                        bsonType: [
                          'null',
                          'string'
                        ],
                        minLength: 10,
                        maxLength: 12,
                        description: 'cellphone must be string and between 10 and 12'
                      },
                      idcard: {
                        bsonType: [
                          'null',
                          'string'
                        ],
                        minLength: 10,
                        maxLength: 12,
                        description: 'idcard must be string and between 10 and 12'
                      },
                      email: {
                        bsonType: [
                          'null',
                          'string'
                        ],
                        minLength: 1,
                        maxLength: 150,
                        description: 'email must be string'
                      },
                      degreeId: {
                        bsonType: [
                          'null',
                          'string'
                        ],
                        minLength: 1,
                        maxLength: 30,
                        description: 'degreeId must be string'
                      },
                      ReligionId: {
                        bsonType: [
                          'null',
                          'string'
                        ],
                        minLength: 1,
                        maxLength: 30,
                        description: 'ReligionId must be string'
                      },
                      MaritalStatus: {
                        bsonType: [
                          'null',
                          'string'
                        ],
                        minLength: 5,
                        maxLength: 50,
                        description: 'MaritalStatus must be string'
                      }
                    }
                  }      
            }
        case "tbltotalWD":
            validateSchema = {
                $jsonSchema:{
                    bsonType: "object",
                    required: ["monthId","yearId","employeeId","WD","WN","AL","PH","CL","KL","OT15","OT20","OT30","OT15N","OT20N","OT30N","totalWD"],
                    properties:{
                        monthId:{
                            bsonType: "int",
                            maximum: 12,
                            description: "monthId must be int and between 1 and 12"
                        },
                        yearId:{
                            bsonType: "int",
                            maximum: 2050,
                            description: "yearId must be int and maximum is 2050"
                        },
                        employeeId:{
                            bsonType: "string",
                            minLength: 5,
                            maxLength: 30,
                            description:"employeeId must be string"
                        },
                        WD:{
                            bsonType: "double",
                            description: "WD must be double"
                        },
                        WN:{
                            bsonType: "double",
                            description: "WN must be double"
                        },
                        AL:{
                            bsonType: "double",
                            description: "AL must be double"
                        },
                        PH:{
                            bsonType: "double",
                            description: "PH must be double"
                        },
                        CL:{
                            bsonType: "double",
                            description: "CL must be double"
                        },
                        KL:{
                            bsonType: "double",
                            description: "KL must be double"
                        },
                        OT15:{
                            bsonType: "double",
                            description: "OT15 must be double"
                        },
                        OT20:{
                            bsonType: "double",
                            description: "OT20 must be double"
                        },
                        OT30:{
                            bsonType: "double",
                            description: "OT30 must be double"
                        },
                        OT15N:{
                            bsonType: "double",
                            description: "OT15N must be double"
                        },
                        OT20N:{
                            bsonType: "double",
                            description: "OT20N must be double"
                        },
                        OT30N:{
                            bsonType: "double",
                            description: "OE30N must be double"
                        },
                        totalWD:{
                            bsonType: "double",
                            description: "totalWD must be double"
                        },
                    }
                }
            }
            break;
        case "tblref_allowance":
            validateSchema = {
                $jsonSchema:{
                    bsonType: "object",
                    required: ["allowanceId","allowanceName","IsFix","IsTax","IsBH","note"],
                    properties:{
                        allowanceId:{
                            bsonType: "string",
                            maxLength: 30,
                            description: "allowanceId must be string"
                        },
                        allowanceName:{
                            bsonType: "string",
                            maxLength: 250,
                            description: "allowanceName must be string"
                        },
                        IsFix:{
                            bsonType: "bool",
                            description: "IsFix must be bool"
                        },
                        IsTax:{
                            bsonType: "bool",
                            description: "IsTax must be bool"
                        },
                        IsBH:{
                            bsonType: "bool",
                            description: "IsBH must be bool"
                        },
                        note:{
                            bsonType: ["null","string"],
                            maxLength: 250,
                            description: "note must be string"
                        }
                    }
                }
            };
        break;
    case "tblempAllowance":
        validateSchema = {
            $jsonSchema:{
                bsonType:"object",
                required: ["employeeId","dateChange","allowanceId","amount","note"],
                properties:{
                    employeeId:{
                        bsonType: "string",
                        minLength: 5,
                        maxLength: 30,
                        description:"employeeId must be string"
                    },
                    dateChange:{
                        bsonType: "date",
                        description: "dateChange must be date"
                    },
                    allowanceId:{
                        bsonType: "string",
                        enum: checkExists[0],
                        description: "allowanceId must be string"
                    },
                    amount:{
                        bsonType: "double",
                        description: "amount must be double"
                    },
                    note:{
                        bsonType:["null","string"],
                        description: "note must be string"
                    }
                }
            }
        };
    break;
    case "tblempAllowanceFix":
        validateSchema = {
            $jsonSchema:{
                bsonType:"object",
                required: ["employeeId","dateChange","allowanceId","amount","note"],
                properties:{
                    employeeId:{
                        bsonType: "string",
                        minLength: 5,
                        maxLength: 30,
                        description:"employeeId must be string"
                    },
                    dateChange:{
                        bsonType: "date",
                        description: "dateChange must be date"
                    },
                    allowanceId:{
                        bsonType: "string",
                        enum: checkExists[0],
                        description: "allowanceId must be string"
                    },
                    amount:{
                        bsonType: "double",
                        description: "amount must be double"
                    },
                    note:{
                        bsonType:["null","string"],
                        description: "note must be string"
                    }
                }
            }
        };
    break;
    case "tblempSalary":
        validateSchema = {
            $jsonSchema:{
                bsonType:"object",
                required: ["employeeId","dateChange","basicSalary","curType","note"],
                properties:{
                    employeeId:{
                        bsonType: "string",
                        minLength: 5,
                        maxLength: 30,
                        description:"employeeId must be string"
                    },
                    dateChange:{
                        bsonType: "date",
                        description: "dateChange must be date"
                    },
                    basicSalary:{
                        bsonType: "double",
                        description: "basicSalary must be double"
                    },
                    curType:{
                        bsonType: "string",
                        enum:["VND","USD"],
                        description: "curType must be string and in (VND,USD)"
                    },
                    note:{
                        bsonType:["null","string"],
                        description: "note must be string"
                    }
                }
            }
        };
    break;
    case "tblref_addDeduct":
            validateSchema = {
                $jsonSchema:{
                    bsonType: "object",
                    required: ["addDeductId","addDeductName","IsTax","note"],
                    properties:{
                        addDeductId:{
                            bsonType: "string",
                            maxLength: 30,
                            description: "addDeductId must be string"
                        },
                        addDeductName:{
                            bsonType: "string",
                            maxLength: 250,
                            description: "addDeductName must be string"
                        },
                        IsTax:{
                            bsonType: "bool",
                            description: "IsTax must be bool"
                        },
                        note:{
                            bsonType: ["null","string"],
                            maxLength: 250,
                            description: "note must be string"
                        }
                    }
                }
            };
        break;
        case "tblempAddDeduct":
            validateSchema = {
                $jsonSchema:{
                    bsonType:"object",
                    required: ["employeeId","dateChange","Type","addDeductId","amount","curType","note"],
                    properties:{
                        employeeId:{
                            bsonType: "string",
                            minLength: 5,
                            maxLength: 30,
                            description:"employeeId must be string"
                        },
                        dateChange:{
                            bsonType: "date",
                            description: "dateChange must be date"
                        },
                        Type:{
                            bsonType: "string",
                            enum:["A","D"],
                            description: "Type must be string and in(A,D)"
                        },  
                        addDeductId:{
                            bsonType: "string",
                            maxLength: 30,
                            enum: checkExists[0],
                            description: "addDeductId must be string"
                        },
                        amount:{
                            bsonType: "double",
                            description: "amount must be double"
                        },
                        curType:{
                            bsonType: "string",
                            enum:["VND","USD"],
                            description: "curType must be string and in (VND,USD)"
                        },
                        note:{
                            bsonType:["null","string"],
                            description: "note must be string"
                        }
                    }
                }
            };
        break;
    case "tblpayroll":
        validateSchema = {
            $jsonSchema:{
                bsonType: "object",
                required: [ "yearId",
                            "monthId",
                            "employeeId",
                            "employedDate",
                            "birthDate",
                            "leftDate",
                            "sexName",
                            "WD",
                            "WN",
                            "totalWD",
                            "AL",
                            "PH",
                            "CL",
                            "KL",
                            "totalLeaveCL",
                            "totalLeaveKL",
                            "totalLeave",
                            "OT15",
                            "OT20",
                            "OT30",
                            "OT15N",
                            "OT20N",
                            "OT30N",
                            "totalOTDay",
                            "totalOTNight",
                            "totalOT",
                            "WDSal",
                            "WNSal",
                            "totalWDSal",
                            "ALSal",
                            "PHSal",
                            "CLSal",
                            "KLSal",
                            "totalLeaveCLSal",
                            "totalLeaveKLSal",
                            "totalLeaveSal",
                            "OT15Sal",
                            "OT20Sal",
                            "OT30Sal",
                            "OT15NSal",
                            "OT20NSal",
                            "OT30NSal",
                            "totalOTSalDay",
                            "totalOTSal",
                            "OT15SalTax",
                            "OT20SalTax",
                            "OT30SalTax",
                            "OT15NSalTax",
                            "OT20NSalTax",
                            "OT30NSalTax",
                            "totalOTSalTax",
                            "totalAllowanceSal",
                            "totalAllowanceTaxSal",
                            "totalAllowanceFixSal",
                            "totalAllowanceFixTaxSal",
                            "totalAddSal",
                            "totalAddTaxSal",
                            "totalDeductSal",
                            "totalDeductTaxSal",
                            "SI_emp",
                            "HI_emp",
                            "UI_emp",
                            "Ins_emp_total",
                            "SI_comp",
                            "HI_comp",
                            "UI_comp",
                            "Ins_comp_total",
                            "totalFamilyDepen",
                            "totalFamilyDepenSal",
                            "totalSal",
                            "totalSalTax",
                            "incomeTax",
                            "takehome",
                            "takehomeRound"
                          ],
                properties:{
                    yearId:{     bsonType: ["int"],           description: " yearId must be int."   },
                    monthId:{     bsonType: ["int"],           description: " monthId must be int."   },
                    employeeId:{     bsonType: ["string"],           description: " employeeId must be string."   },
                    employedDate:{     bsonType: ["null","date"],           description: " employedDate must be date."   },
                    birthDate:{     bsonType: ["null","date"],           description: " birthDate must be date."   },
                    leftDate:{     bsonType: ["null","date"],           description: " leftDate must be date."   },
                    sexName:{     bsonType: ["null","string"], enum:["nam","nữ"],       description: " sexName must be double."   },
                    WD:{     bsonType: ["null","double"],           description: " WD must be double."   },
                    WN:{     bsonType: ["null","double"],           description: " WN must be double."   },
                    totalWD:{     bsonType: ["null","double"],           description: " totalWD must be double."   },
                    AL:{     bsonType: ["null","double"],           description: " AL must be double."   },
                    PH:{     bsonType: ["null","double"],           description: " PH must be double."   },
                    CL:{     bsonType: ["null","double"],           description: " CL must be double."   },
                    KL:{     bsonType: ["null","double"],           description: " KL must be double."   },
                    totalLeaveCL:{     bsonType: ["null","double"],           description: " totalLeaveCL must be double."   },
                    totalLeaveKL:{     bsonType: ["null","double"],           description: " totalLeaveKL must be double."   },
                    totalLeave:{     bsonType: ["null","double"],           description: " totalLeave must be double."   },
                    OT15:{     bsonType: ["null","double"],           description: " OT15 must be double."   },
                    OT20:{     bsonType: ["null","double"],           description: " OT20 must be double."   },
                    OT30:{     bsonType: ["null","double"],           description: " OT30 must be double."   },
                    OT15N:{     bsonType: ["null","double"],           description: " OT15N must be double."   },
                    OT20N:{     bsonType: ["null","double"],           description: " OT20N must be double."   },
                    OT30N:{     bsonType: ["null","double"],           description: " OT30N must be double."   },
                    totalOTDay:{     bsonType: ["null","double"],           description: " totalOTDay must be double."   },
                    totalOTNight:{     bsonType: ["null","double"],           description: " totalOTNight must be double."   },
                    totalOT:{     bsonType: ["null","double"],           description: " totalOT must be double."   },
                    WDSal:{     bsonType: ["null","double"],           description: " WDSal must be double."   },
                    WNSal:{     bsonType: ["null","double"],           description: " WNSal must be double."   },
                    totalWDSal:{     bsonType: ["null","double"],           description: " totalWDSal must be double."   },
                    ALSal:{     bsonType: ["null","double"],           description: " ALSal must be double."   },
                    PHSal:{     bsonType: ["null","double"],           description: " PHSal must be double."   },
                    CLSal:{     bsonType: ["null","double"],           description: " CLSal must be double."   },
                    KLSal:{     bsonType: ["null","double"],           description: " KLSal must be double."   },
                    totalLeaveCLSal:{     bsonType: ["null","double"],           description: " totalLeaveCLSal must be double."   },
                    totalLeaveKLSal:{     bsonType: ["null","double"],           description: " totalLeaveKLSal must be double."   },
                    totalLeaveSal:{     bsonType: ["null","double"],           description: " totalLeaveSal must be double."   },
                    OT15Sal:{     bsonType: ["null","double"],           description: " OT15Sal must be double."   },
                    OT20Sal:{     bsonType: ["null","double"],           description: " OT20Sal must be double."   },
                    OT30Sal:{     bsonType: ["null","double"],           description: " OT30Sal must be double."   },
                    OT15NSal:{     bsonType: ["null","double"],           description: " OT15NSal must be double."   },
                    OT20NSal:{     bsonType: ["null","double"],           description: " OT20NSal must be double."   },
                    OT30NSal:{     bsonType: ["null","double"],           description: " OT30NSal must be double."   },
                    totalOTSalDay:{     bsonType: ["null","double"],           description: " totalOTSalDay must be double."   },
                    totalOTSal:{     bsonType: ["null","double"],           description: " totalOTSal must be double."   },
                    OT15SalTax:{     bsonType: ["null","double"],           description: " OT15SalTax must be double."   },
                    OT20SalTax:{     bsonType: ["null","double"],           description: " OT20SalTax must be double."   },
                    OT30SalTax:{     bsonType: ["null","double"],           description: " OT30SalTax must be double."   },
                    OT15NSalTax:{     bsonType: ["null","double"],           description: " OT15NSalTax must be double."   },
                    OT20NSalTax:{     bsonType: ["null","double"],           description: " OT20NSalTax must be double."   },
                    OT30NSalTax:{     bsonType: ["null","double"],           description: " OT30NSalTax must be double."   },
                    totalOTSalTax:{     bsonType: ["null","double"],           description: " totalOTSalTax must be double."   },
                    totalAllowanceSal:{     bsonType: ["null","double"],           description: " totalAllowanceSal must be double."   },
                    totalAllowanceTaxSal:{     bsonType: ["null","double"],           description: " totalAllowanceTaxSal must be double."   },
                    totalAllowanceFixSal:{     bsonType: ["null","double"],           description: " totalAllowanceFixSal must be double."   },
                    totalAllowanceFixTaxSal:{     bsonType: ["null","double"],           description: " totalAllowanceFixTaxSal must be double."   },
                    totalAddSal:{     bsonType: ["null","double"],           description: " totalAddSal must be double."   },
                    totalAddTaxSal:{     bsonType: ["null","double"],           description: " totalAddTaxSal must be double."   },
                    totalDeductSal:{     bsonType: ["null","double"],           description: " totalDeductSal must be double."   },
                    totalDeductTaxSal:{     bsonType: ["null","double"],           description: " totalDeductTaxSal must be double."   },
                    SI_emp:{     bsonType: ["null","double"],           description: " SI_emp must be double."   },
                    HI_emp:{     bsonType: ["null","double"],           description: " HI_emp must be double."   },
                    UI_emp:{     bsonType: ["null","double"],           description: " UI_emp must be double."   },
                    Ins_emp_total:{     bsonType: ["null","double"],           description: " Ins_emp_total must be double."   },
                    SI_comp:{     bsonType: ["null","double"],           description: " SI_comp must be double."   },
                    HI_comp:{     bsonType: ["null","double"],           description: " HI_comp must be double."   },
                    UI_comp:{     bsonType: ["null","double"],           description: " UI_comp must be double."   },
                    Ins_comp_total:{     bsonType: ["null","double"],           description: " Ins_comp_total must be double."   },
                    totalFamilyDepen:{     bsonType: ["null","double"],           description: " totalFamilyDepen must be double."   },
                    totalFamilyDepenSal:{     bsonType: ["null","double"],           description: " totalFamilyDepenSal must be double."   },
                    totalSal:{     bsonType: ["null","double"],           description: " totalSal must be double."   },
                    totalSalTax:{     bsonType: ["null","double"],           description: " totalSalTax must be double."   },
                    incomeTax:{     bsonType: ["null","double"],           description: " incomeTax must be double."   },
                    takehome:{     bsonType: ["null","double"],           description: " takehome must be double."   },
                    takehomeRound:{     bsonType: ["null","double"],           description: " takehomeRound must be double."   },
                }
            },
            
        }
    break;
    case "tblref_payrollParameter":
        validateSchema = {
            $jsonSchema:{
                bsonType: "object",
                required: ["paraId","paraName","value","note"],
                properties:{
                    paraId:{
                        bsonType: "string",
                        maxLength: 30,
                        description: "paraId must be string"
                    },
                    paraName:{
                        bsonType: "string",
                        maxLength: 250,
                        description: "paraName must be string"
                    },
                    value:{
                        bsonType: ["null","string","double"],
                        description: "value must be in (null, string, double)"
                    },
                    note:{
                        bsonType: ["null","string"]
                    }
                }
            }
        };
        break;
    case "tblaccount":
        validateSchema = {
            $jsonSchema: {
                bsonType: "object",
                required: ["accountId","accountName","email","pwd","atoken","rtoken","note"],
                properties:{
                    accountId:{
                        bsonType: "string",
                        maxLength: 30,
                        description: "accountId must be string"
                    },
                    accountName:{
                        bsonType: "string",
                        maxLength: 250,
                        description: "accountName must be string"
                    },
                    email:{
                        bsonType: ["null","string"],
                        maxLength: 150,
                        description: "email must be string"
                    },
                    pwd:{
                        bsonType: "string",
                        description: "password must be string"
                    },
                    atoken:{
                        bsonType: "string",
                        description: "atoken must be string"
                    },
                    rtoken:{
                        bsonType: "string",
                        description: "rtoken must be string"
                    },
                    note:{
                        bsonType: ["null","string"],
                        description: "note must be string"
                    }
                }
            }
        }
        break;
    }
    return validateSchema;
}

module.exports = getValidateSchema;