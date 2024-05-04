const mongodb = require('mongodb').MongoClient;
const connectString = require('../../databaseConnections/mongoDbConnection');
const supportFunction = require('../../other/supportFunction');
const dbName = "humanproject";

// get max position with todate
async function ufnGetMaxPos(todate)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);  
    try{
        const collempPos = await db.collection('tblemppos').aggregate(
            [
                {$match:{
                    dateChange:{
                        $lte: new Date(todate)
                    }
                }
                },
                {$setWindowFields:{
                    partitionBy: "$employeeId",
                    sortBy: {dateChange:-1},
                    output:{    
                        maxdateChange:{ $max:"$dateChange"}
                    }
                }},
                {$match:{
                        $expr:{
                            $eq:["$dateChange","$maxdateChange"]
                        }
                    }
                },
                {$lookup:{
                    from:"tblref_position",
                    localField:"posId",
                    foreignField:"posId",
                    as:"result"
                }
                },
                {
                    $replaceRoot:{
                        newRoot:{$mergeObjects:[{$arrayElemAt:["$result",0]},"$$ROOT"]}
                    }
                },
                {$project:{
                    _id:0,
                    maxdateChange: 0,
                    result:0
                },
                }
            ]
        ).toArray();
        const collempPosFormat = [...collempPos].map(ele => ({

                employeeId: ele.employeeId,
                dateChange: supportFunction.castDate(ele.dateChange,2),
                posName: ele.posName,
                note: ele.note
        }))
        return collempPosFormat;
    } catch (error) {
        //console.log(error);
        throw error;
    }finally{
        await connect.close();
    }
};

// change position history of employee
// 5 times default
async function changePosHistory(fromdate,todate){
    
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    try {
    const collempPos = await db.collection('tblemppos').aggregate([
        {
            $match:{
                dateChange:{  
                    $gte: new Date(fromdate),
                    $lte: new Date(todate),             
                }
            }
        }
        ,
        {
            $setWindowFields:{
                partitionBy:"$employeeId",
                sortBy: {dateChange: 1},
                output:{
                    keyId:{$documentNumber: {}}
                }
            }
        },
        {
            $group:{
                _id:"$employeeId",
                listMerge:{
                    $push:"$$ROOT"
                }
            }
        }
    ]).toArray();   
    const collemprefPos = await db.collection('tblref_position').find({}).project({_id:0,posId:1,posName:1}).toArray();

    function getPosName(posId){
        const posName = (collemprefPos.filter(ele => ele.posId === posId)).map(eleInner => eleInner.posName).toString();
        return posName;
    }
    const collempPosFormat = [...collempPos].map(ele =>{
        const l = ele.listMerge.length;
        const result = {
            employeeId: ele._id,
            dateChange1: (l > 0) ? ele.listMerge[0].dateChange : null,
            posChange1: (l > 0) ? getPosName(ele.listMerge[0].posId) : null,   
            dateChange2: (l > 1) ? ele.listMerge[1].dateChange : null,
            posChange2: (l > 1) ? getPosName(ele.listMerge[1].posId) : null,    
            dateChange3: (l > 2) ? ele.listMerge[2].dateChange : null,
            posChange3: (l > 2) ? getPosName(ele.listMerge[2].posId) : null,
            dateChange4: (l > 3) ? ele.listMerge[3].dateChange : null,
            posChange4: (l > 3) ? getPosName(ele.listMerge[3].posId) : null,
            dateChange5: (l > 4) ? ele.listMerge[4].dateChange : null,
            posChange5: (l > 4) ? getPosName(ele.listMerge[4].posId) : null,
        }
        return result;
    }); 
        return collempPosFormat;
    } catch (error) {
        //console.log(error);
        throw error;
    } finally{
        await connect.close();
    }
}
module.exports = {
    ufnGetMaxPos: ufnGetMaxPos,
    changePosHistory: changePosHistory
};

