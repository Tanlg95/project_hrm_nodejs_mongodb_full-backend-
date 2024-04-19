const mongodb = require('mongodb').MongoClient;
const connectString = require('../../databaseConnections/mongoDbConnection');
const supportFunction = require('../../other/supportFunction');


async function ufnGetMaxDep(todate)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db('humanproject');
    try {
        // const getListEmpDep = await db.collection('tblempdep').aggregate([
        //     {
        //       '$match': {
        //         'dateChange': {
        //           '$lte': new Date(todate)
        //         }
        //       }
        //     }, {
        //       '$setWindowFields': {
        //         'partitionBy': '$employeeId', 
        //         'sortBy': {
        //           'dateChange': -1
        //         }, 
        //         'output': {
        //           'maxdateChange': {
        //             '$max': '$dateChange'
        //           }
        //         }
        //       }
        //     }, {
        //       '$match': {
        //         '$expr': {
        //           '$eq': [
        //             '$dateChange', '$maxdateChange'
        //           ]
        //         }
        //       }
        //     }, {
        //       '$lookup': {
        //         'from': 'tblref_department', 
        //         'pipeline': [
        //           {
        //             '$project': {
        //               'depId': 1, 
        //               'depName': 1, 
        //               '_id': 0
        //             }
        //           }
        //         ], 
        //         'as': 'result'
        //       }
        //     }, {
        //       '$addFields': {
        //         'newresult': {
        //           '$filter': {
        //             'input': '$result', 
        //             'as': 'ele', 
        //             'cond': {
        //               '$in': [
        //                 '$$ele.depId', [
        //                   '$sectionId', '$lineId', '$groupId', '$teamId', '$partId'
        //                 ]
        //               ]
        //             }
        //           }
        //         }
        //       }
        //     }, {
        //       '$unwind': '$newresult'
        //     }, {
        //       '$replaceRoot': {
        //         'newRoot': {
        //           '$mergeObjects': [
        //             '$newresult', '$$ROOT'
        //           ]
        //         }
        //       }
        //     }, {
        //       '$addFields': {
        //         'sectionName': {
        //           '$cond': {
        //             'if': {
        //               '$eq': [
        //                 '$sectionId', '$depId'
        //               ]
        //             }, 
        //             'then': '$depName', 
        //             'else': null
        //           }
        //         }, 
        //         'lineName': {
        //           '$cond': {
        //             'if': {
        //               '$eq': [
        //                 '$lineId', '$depId'
        //               ]
        //             }, 
        //             'then': '$depName', 
        //             'else': null
        //           }
        //         }, 
        //         'groupName': {
        //           '$cond': {
        //             'if': {
        //               '$eq': [
        //                 '$groupId', '$depId'
        //               ]
        //             }, 
        //             'then': '$depName', 
        //             'else': null
        //           }
        //         }, 
        //         'teamName': {
        //           '$cond': {
        //             'if': {
        //               '$eq': [
        //                 '$teamId', '$depId'
        //               ]
        //             }, 
        //             'then': '$depName', 
        //             'else': null
        //           }
        //         }, 
        //         'partName': {
        //           '$cond': {
        //             'if': {
        //               '$eq': [
        //                 '$partId', '$depId'
        //               ]
        //             }, 
        //             'then': '$depName', 
        //             'else': null
        //           }
        //         }
        //       }
        //     }, {
        //       '$project': {
        //         'result': 0, 
        //         'maxdateChange': 0, 
        //         'depId': 0, 
        //         'depName': 0, 
        //         'newresult': 0, 
        //         'sectionId': 0, 
        //         'lineId': 0, 
        //         'groupId': 0, 
        //         'teamId': 0, 
        //         'partId': 0
        //       }
        //     }
        //   ]).toArray();
        // getListEmpDep.sort((a,b) => supportFunction.castStringNumber(a.employeeId) - supportFunction.castStringNumber(b.employeeId));
        // let oneRow = {
        //     employeeId:"",
        //     dateChange: new Date(),
        //     sectionName: null,
        //     lineName:null,
        //     groupName:null,
        //     teamName:null,
        //     partName:null,
        //     note:null
        // };
        // const listempDepNew = [];
        // function assign(i)
        // {
        //         oneRow.employeeId =(!getListEmpDep[i].employeeId) ? oneRow.employeeId : getListEmpDep[i].employeeId;
        //         oneRow.dateChange = (!getListEmpDep[i].dateChange) ? oneRow.dateChange : getListEmpDep[i].dateChange;
        //         oneRow.sectionName = (!getListEmpDep[i].sectionName) ? oneRow.sectionName : getListEmpDep[i].sectionName;
        //         oneRow.lineName = (!getListEmpDep[i].lineName) ? oneRow.lineName : getListEmpDep[i].lineName;
        //         oneRow.groupName = (!getListEmpDep[i].groupName) ? oneRow.groupName : getListEmpDep[i].groupName;
        //         oneRow.teamName = (!getListEmpDep[i].teamName) ? oneRow.teamName : getListEmpDep[i].teamName;
        //         oneRow.partName = (!getListEmpDep[i].partName) ? oneRow.partName : getListEmpDep[i].partName;
        // }
        // for(let i = 0 ; i < getListEmpDep.length; ++i)
        // {
        //     if(i === getListEmpDep.length -1)
        //     {
        //         assign(i);
        //         listempDepNew.push(oneRow);
        //         break;
        //     }
        //     if(getListEmpDep[i].employeeId === getListEmpDep[i+1].employeeId)
        //     {
        //         assign(i);
        //     }
        //     else{
        //         assign(i);
        //         listempDepNew.push(oneRow);
        //         oneRow = {
        //             employeeId:"",
        //             dateChange: new Date(),
        //             sectionName: null,
        //             lineName: null,
        //             groupName: null,
        //             teamName: null,
        //             partName: null,
        //             note: null
        //         };
        //     }
        // }
        // filter list employee department with max datechange
        const getListEmpDep = await db.collection('tblempdep').aggregate([
            {
              '$match': {
                'dateChange': {
                  '$lte': new Date(todate)
                }
              }
            }, {
              '$setWindowFields': {
                'partitionBy': '$employeeId', 
                'sortBy': {
                  'dateChange': -1
                }, 
                'output': {
                  'maxdateChange': {
                    '$max': '$dateChange'
                  }
                }
              }
            }, {
              '$match': {
                '$expr': {
                  '$eq': [
                    '$dateChange', '$maxdateChange'
                  ]
                }
              }
            }, {
              '$project': {
                'maxdateChange': 0
              }
            }
          ]).toArray();
          // get department structure object: {depid: 1,depName:1}
          const gettblref_department = await db.collection('tblref_department').find({}).project({_id:0,depId:1,depName:1}).toArray();
          const result = getListEmpDep.map(ele =>{
                const newEle = {
                    employeeId: ele.employeeId,
                    dateChange: ele.dateChange,
                    // assign depName which matched depId
                    sectionName: (!ele.sectionId)? null: gettblref_department.filter(eleInner => eleInner.depId === ele.sectionId)[0].depName,
                    lineName: (!ele.lineId)? null: gettblref_department.filter(eleInner => eleInner.depId === ele.lineId)[0].depName,
                    groupName: (!ele.groupId)? null: gettblref_department.filter(eleInner => eleInner.depId === ele.groupId)[0].depName,
                    teamName: (!ele.teamId)? null: gettblref_department.filter(eleInner => eleInner.depId === ele.teamId)[0].depName,
                    partName: (!ele.partId)? null: gettblref_department.filter(eleInner => eleInner.depId === ele.partId)[0].depName
                }
                return newEle;
          });
        //console.log(listempDepNew);
        return result;
    } catch (error) {
        console.log(error);
        //throw error;
    }finally{
        connect.close();
    }
};

// change department history of employee
// 5 times default
async function changeDepHistory(fromdate,todate){
    
    const connect = await mongodb.connect(connectString);
    const db = connect.db('humanproject');
    try {
        const getListHistoryDepChange = await db.collection('tblempdep').aggregate([
            {
              '$sort': {
                'employeeId': 1, 
                'dateChange': -1
              }
            }, {
              '$match': {
                'dateChange': {
                  '$gte': new Date(fromdate), 
                  '$lte': new Date(todate)
                }
              }
            }, {
              '$group': {
                '_id': '$employeeId', 
                'depHistory': {
                  '$push': '$$ROOT'
                }
              }
            }, {
              '$addFields': {
                'changeTime1': {
                  '$arrayElemAt': [
                    '$depHistory', 0
                  ]
                }, 
                'changeTime2': {
                  '$arrayElemAt': [
                    '$depHistory', 1
                  ]
                }, 
                'changeTime3': {
                  '$arrayElemAt': [
                    '$depHistory', 2
                  ]
                }, 
                'changeTime4': {
                  '$arrayElemAt': [
                    '$depHistory', 3
                  ]
                }, 
                'changeTime5': {
                  '$arrayElemAt': [
                    '$depHistory', 4
                  ]
                }
              }
            }, {
              '$addFields': {
                'dateChange1': '$changeTime1.dateChange', 
                'depChange1': {
                  '$cond': {
                    'if': {
                      '$not': {
                        '$in': [
                          '$changeTime1.partId', [
                            null, ''
                          ]
                        ]
                      }
                    }, 
                    'then': '$changeTime1.partId', 
                    'else': {
                      '$cond': {
                        'if': {
                          '$not': {
                            '$in': [
                              '$changeTime1.teamId', [
                                null, ''
                              ]
                            ]
                          }
                        }, 
                        'then': '$changeTime1.teamId', 
                        'else': {
                          '$cond': {
                            'if': {
                              '$not': {
                                '$in': [
                                  '$changeTime1.groupId', [
                                    null, ''
                                  ]
                                ]
                              }
                            }, 
                            'then': '$changeTime1.groupId', 
                            'else': {
                              '$cond': {
                                'if': {
                                  '$not': {
                                    '$in': [
                                      '$changeTime1.lineId', [
                                        null, ''
                                      ]
                                    ]
                                  }
                                }, 
                                'then': '$changeTime1.lineId', 
                                'else': {
                                  '$cond': {
                                    'if': {
                                      '$not': {
                                        '$in': [
                                          '$changeTime1.sectionId', [
                                            null, ''
                                          ]
                                        ]
                                      }
                                    }, 
                                    'then': '$changeTime1.sectionId', 
                                    'else': null
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }, 
                'dateChange2': '$changeTime2.dateChange', 
                'depChange2': {
                  '$cond': {
                    'if': {
                      '$not': {
                        '$in': [
                          '$changeTime2.partId', [
                            null, ''
                          ]
                        ]
                      }
                    }, 
                    'then': '$changeTime2.partId', 
                    'else': {
                      '$cond': {
                        'if': {
                          '$not': {
                            '$in': [
                              '$changeTime2.teamId', [
                                null, ''
                              ]
                            ]
                          }
                        }, 
                        'then': '$changeTime2.teamId', 
                        'else': {
                          '$cond': {
                            'if': {
                              '$not': {
                                '$in': [
                                  '$changeTime2.groupId', [
                                    null, ''
                                  ]
                                ]
                              }
                            }, 
                            'then': '$changeTime2.groupId', 
                            'else': {
                              '$cond': {
                                'if': {
                                  '$not': {
                                    '$in': [
                                      '$changeTime2.lineId', [
                                        null, ''
                                      ]
                                    ]
                                  }
                                }, 
                                'then': '$changeTime2.lineId', 
                                'else': {
                                  '$cond': {
                                    'if': {
                                      '$not': {
                                        '$in': [
                                          '$changeTime2.sectionId', [
                                            null, ''
                                          ]
                                        ]
                                      }
                                    }, 
                                    'then': '$changeTime2.sectionId', 
                                    'else': null
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }, 
                'dateChange3': '$changeTime3.dateChange', 
                'depChange3': {
                  '$cond': {
                    'if': {
                      '$not': {
                        '$in': [
                          '$changeTime3.partId', [
                            null, ''
                          ]
                        ]
                      }
                    }, 
                    'then': '$changeTime3.partId', 
                    'else': {
                      '$cond': {
                        'if': {
                          '$not': {
                            '$in': [
                              '$changeTime3.teamId', [
                                null, ''
                              ]
                            ]
                          }
                        }, 
                        'then': '$changeTime3.teamId', 
                        'else': {
                          '$cond': {
                            'if': {
                              '$not': {
                                '$in': [
                                  '$changeTime3.groupId', [
                                    null, ''
                                  ]
                                ]
                              }
                            }, 
                            'then': '$changeTime3.groupId', 
                            'else': {
                              '$cond': {
                                'if': {
                                  '$not': {
                                    '$in': [
                                      '$changeTime3.lineId', [
                                        null, ''
                                      ]
                                    ]
                                  }
                                }, 
                                'then': '$changeTime3.lineId', 
                                'else': {
                                  '$cond': {
                                    'if': {
                                      '$not': {
                                        '$in': [
                                          '$changeTime3.sectionId', [
                                            null, ''
                                          ]
                                        ]
                                      }
                                    }, 
                                    'then': '$changeTime3.sectionId', 
                                    'else': null
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }, 
                'dateChange4': '$changeTime4.dateChange', 
                'depChange4': {
                  '$cond': {
                    'if': {
                      '$not': {
                        '$in': [
                          '$changeTime4.partId', [
                            null, ''
                          ]
                        ]
                      }
                    }, 
                    'then': '$changeTime4.partId', 
                    'else': {
                      '$cond': {
                        'if': {
                          '$not': {
                            '$in': [
                              '$changeTime4.teamId', [
                                null, ''
                              ]
                            ]
                          }
                        }, 
                        'then': '$changeTime4.teamId', 
                        'else': {
                          '$cond': {
                            'if': {
                              '$not': {
                                '$in': [
                                  '$changeTime4.groupId', [
                                    null, ''
                                  ]
                                ]
                              }
                            }, 
                            'then': '$changeTime4.groupId', 
                            'else': {
                              '$cond': {
                                'if': {
                                  '$not': {
                                    '$in': [
                                      '$changeTime4.lineId', [
                                        null, ''
                                      ]
                                    ]
                                  }
                                }, 
                                'then': '$changeTime4.lineId', 
                                'else': {
                                  '$cond': {
                                    'if': {
                                      '$not': {
                                        '$in': [
                                          '$changeTime4.sectionId', [
                                            null, ''
                                          ]
                                        ]
                                      }
                                    }, 
                                    'then': '$changeTime4.sectionId', 
                                    'else': null
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }, 
                'dateChange5': '$changeTime5.dateChange', 
                'depChange5': {
                  '$cond': {
                    'if': {
                      '$not': {
                        '$in': [
                          '$changeTime5.partId', [
                            null, ''
                          ]
                        ]
                      }
                    }, 
                    'then': '$changeTime5.partId', 
                    'else': {
                      '$cond': {
                        'if': {
                          '$not': {
                            '$in': [
                              '$changeTime5.teamId', [
                                null, ''
                              ]
                            ]
                          }
                        }, 
                        'then': '$changeTime5.teamId', 
                        'else': {
                          '$cond': {
                            'if': {
                              '$not': {
                                '$in': [
                                  '$changeTime5.groupId', [
                                    null, ''
                                  ]
                                ]
                              }
                            }, 
                            'then': '$changeTime5.groupId', 
                            'else': {
                              '$cond': {
                                'if': {
                                  '$not': {
                                    '$in': [
                                      '$changeTime5.lineId', [
                                        null, ''
                                      ]
                                    ]
                                  }
                                }, 
                                'then': '$changeTime5.lineId', 
                                'else': {
                                  '$cond': {
                                    'if': {
                                      '$not': {
                                        '$in': [
                                          '$changeTime5.sectionId', [
                                            null, ''
                                          ]
                                        ]
                                      }
                                    }, 
                                    'then': '$changeTime5.sectionId', 
                                    'else': null
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }, {
              '$addFields': {
                'datechange1N': {
                  '$ifNull': [
                    '$dateChange1', null
                  ]
                }, 
                'depChange1N': {
                  '$ifNull': [
                    '$depChange1', null
                  ]
                }, 
                'datechange2N': {
                  '$ifNull': [
                    '$dateChange2', null
                  ]
                }, 
                'depChange2N': {
                  '$ifNull': [
                    '$depChange2', null
                  ]
                }, 
                'datechange3N': {
                  '$ifNull': [
                    '$dateChange3', null
                  ]
                }, 
                'depChange3N': {
                  '$ifNull': [
                    '$depChange3', null
                  ]
                }, 
                'datechange4N': {
                  '$ifNull': [
                    '$dateChange4', null
                  ]
                }, 
                'depChange4N': {
                  '$ifNull': [
                    '$depChange4', null
                  ]
                }, 
                'datechange5N': {
                  '$ifNull': [
                    '$dateChange5', null
                  ]
                }, 
                'depChange5N': {
                  '$ifNull': [
                    '$depChange5', null
                  ]
                }
              }
            }, {
              '$project': {
                'depHistory': 0, 
                'changeTime1': 0, 
                'changeTime2': 0, 
                'changeTime3': 0, 
                'changeTime4': 0, 
                'changeTime5': 0, 
                'depChange1': 0, 
                'depChange2': 0, 
                'depChange3': 0, 
                'depChange4': 0, 
                'depChange5': 0, 
                'dateChange1': 0, 
                'dateChange2': 0, 
                'dateChange3': 0, 
                'dateChange4': 0, 
                'dateChange5': 0
              }
            }
          ]).toArray();
        // get department structure object: {depid: 1,depName:1}
        const gettblref_department = await db.collection('tblref_department').find({}).project({_id:0,depId:1,depName:1}).toArray();
        const result = getListHistoryDepChange.map(ele =>{
              const newEle = {
                  employeeId: ele._id,
                  // assign depName which matched depId
                  datechange1N: (!ele.datechange1N)? null: ele.datechange1N,
                  depChange1N: (!ele.depChange1N)? null: gettblref_department.filter(eleInner => eleInner.depId === ele.depChange1N)[0].depName,
                  datechange2N: (!ele.datechange2N)? null: ele.datechange2N,
                  depChange2N: (!ele.depChange2N)? null: gettblref_department.filter(eleInner => eleInner.depId === ele.depChange2N)[0].depName,
                  datechange3N: (!ele.datechange3N)? null: ele.datechange3N,
                  depChange3N: (!ele.depChange3N)? null: gettblref_department.filter(eleInner => eleInner.depId === ele.depChange3N)[0].depName,
                  datechange4N: (!ele.datechange4N)? null: ele.datechange4N,
                  depChange4N: (!ele.depChange4N)? null: gettblref_department.filter(eleInner => eleInner.depId === ele.depChange4N)[0].depName,
                  datechange5N: (!ele.datechange5N)? null: ele.datechange5N,
                  depChange5N: (!ele.depChange5N)? null: gettblref_department.filter(eleInner => eleInner.depId === ele.depChange5N)[0].depName,
              }
              return newEle;
        });
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    } finally{
        connect.close();
    }
}
module.exports = {
    ufnGetMaxDep: ufnGetMaxDep,
    changeDepHistory: changeDepHistory
};

