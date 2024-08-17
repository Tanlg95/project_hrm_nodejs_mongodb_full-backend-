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

// get parameter for cal
const getListParameter = require('../parameter/payrollParameterFunction').getListparameter;
// caculate payroll 

async function callPayroll(monthid,yearid,employeeid)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
    const tblemployee = 'tblemployee';
    const tbltotalWD = 'tbltotalWD';
    const tblpayroll = 'tblpayroll';
    const colltblemployee = db.collection(tblemployee);
    const colltbltotalWD = db.collection(tbltotalWD);
    const colltblpayroll = db.collection(tblpayroll);

    console.log(monthid);

    try {
    const firstOfMonth = getMonth(monthid,yearid,0);
    const lastOfMonth = getMonth(monthid,yearid,1);

    // get list employee for caculate payroll
    const getListEmployeeForCal = await colltblemployee.aggregate([
        {
          $lookup: {
            from: "tblempContract",
            let: { employeeId: "$employeeId" },
            pipeline: [
              {
                $match: {
                  fromdate: {
                    $lte: castDate(lastOfMonth,0),
                  },
                },
              },
              {
                $setWindowFields: {
                  partitionBy: "$employeeId",
                  sortBy: { fromdte: -1 },
                  output: {
                    maxfromdate: { $max: "$fromdate" },
                  },
                },
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$fromdate",
                          "$maxfromdate",
                        ],
                      },
                      {
                        $eq: [
                          "$employeeId",
                          "$$employeeId",
                        ],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  maxfromdate: 0,
                  employeeId: 0,
                },
              },
            ],
            as: "contract",
          },
        },
        {
          $lookup: {
            from: "tblempdep",
            let: { employeeId: "$employeeId" },
            pipeline: [
              {
                $match: {
                  dateChange: {
                    $lte: castDate(lastOfMonth,0),
                  },
                },
              },
              {
                $setWindowFields: {
                  partitionBy: "$employeeId",
                  sortBy: { dateChange: -1 },
                  output: {
                    maxdateChange: {
                      $max: "$dateChange",
                    },
                  },
                },
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$dateChange",
                          "$maxdateChange",
                        ],
                      },
                      {
                        $eq: [
                          "$employeeId",
                          "$$employeeId",
                        ],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  maxdateChange: 0,
                  employeeId: 0,
                },
              },
            ],
            as: "department",
          },
        },
        {
          $project: {
            employeeId: 1,
            employeeName: 1,
            birthDate: 1,
            employedDate: 1,
            leftDate: 1,
            sex: 1,
            address: 1,
            cellphone: 1,
            idcard: 1,
            email: 1,
            degreeId: 1,
            ReligionId: 1,
            MaritalStatus: 1,
            contract: {
              $cond: {
                if: { $arrayElemAt: ["$contract", 0] },
                then: 1,
                else: 0,
              },
            },
            department: {
              $cond: {
                if: {
                  $arrayElemAt: ["$department", 0],
                },
                then: {
                  $cond: {
                    if: {
                      //$not:{
                      $ne: [
                        {
                          $ifNull: [
                            {
                              $arrayElemAt: [
                                "$department.partId",
                                0,
                              ],
                            },
                            "X",
                          ],
                        },
                        "X",
                      ],
                      // }
                    },
                    then: {
                      $arrayElemAt: [
                        "$department.partId",
                        0,
                      ],
                    },
                    else: {
                      $cond: {
                        if: {
                          //$not:{
                          $ne: [
                            {
                              $ifNull: [
                                {
                                  $arrayElemAt: [
                                    "$department.teamId",
                                    0,
                                  ],
                                },
                                "X",
                              ],
                            },
                            "X",
                          ],
                          // }
                        },
                        then: {
                          $arrayElemAt: [
                            "$department.teamId",
                            0,
                          ],
                        },
                        else: {
                          $cond: {
                            if: {
                              //$not:{
                              $ne: [
                                {
                                  $ifNull: [
                                    {
                                      $arrayElemAt: [
                                        "$department.groupId",
                                        0,
                                      ],
                                    },
                                    "X",
                                  ],
                                },
                                "X",
                              ],
                              // }
                            },
                            then: {
                              $arrayElemAt: [
                                "$department.groupId",
                                0,
                              ],
                            },
                            else: {
                              $cond: {
                                if: {
                                  //$not:{
                                  $ne: [
                                    {
                                      $ifNull: [
                                        {
                                          $arrayElemAt:
                                            [
                                              "$department.lineId",
                                              0,
                                            ],
                                        },
                                        "X",
                                      ],
                                    },
                                    "X",
                                  ],
                                  // }
                                },
                                then: {
                                  $arrayElemAt: [
                                    "$department.lineId",
                                    0,
                                  ],
                                },
                                else: {
                                  $arrayElemAt: [
                                    "$department.sectionId",
                                    0,
                                  ],
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                else: 0,
              },
            },
          },
        },
        {
          $match: {
            $expr: {
              $lte: [
                "$leftDate",
                new castDate(lastOfMonth,0),
              ],
            },
            contract: 1,
          },
        },
      ]).toArray();

    // list employeeId
    const listEmployeeId = (employeeid !== '')? ([...getListEmployeeForCal].map(ele => ele.employeeId)).filter(employeeidv => employeeidv === employeeid ) : [...getListEmployeeForCal].map(ele => ele.employeeId);
    // get list totalWDSal
    const getListTotalWDsalary = await calTotalWD(monthid,yearid,listEmployeeId);
    // get list insurance
    const getListInsuraceSal = await calInsurance(monthid,yearid,listEmployeeId);
    // get list allowance
    const getListAllowance = await calAllowance(monthid,yearid,listEmployeeId);
    // get list allowanceFix
    const getListAllowanceFix = await calAllowanceFix(monthid,yearid,listEmployeeId);
    // get list add 
    const getListAdd = await calAddDeduct(monthid,yearid,listEmployeeId,'A');
    // get list Deduct
    const getListDeduct = await calAddDeduct(monthid,yearid,listEmployeeId,'D');
    // GET list pit salary
    const getlistDepenSal =  await calPIT(monthid,yearid,listEmployeeId);
    
    
    // caculate work day salary
    //#region 
    
    const payroll = [...getListEmployeeForCal].map(
        employeeId =>{

            const totalWDSal = (getListTotalWDsalary.filter(ele => ele.employeeId === employeeId.employeeId))[0];
            const insuraceSal = (getListInsuraceSal.filter(ele => ele.employeeId === employeeId.employeeId))[0];
            const allowance = (getListAllowance.filter(ele => ele.employeeId === employeeId.employeeId))[0];
            const allowanceFix = (getListAllowanceFix.filter(ele => ele.employeeId === employeeId.employeeId))[0];
            const add = (getListAdd.filter(ele => ele.employeeId === employeeId.employeeId))[0];
            const deduct = (getListDeduct.filter(ele => ele.employeeId === employeeId.employeeId))[0];
            const pitSal = (getlistDepenSal.filter(ele => ele.employeeId === employeeId.employeeId))[0];

            const listEmployeeId ={
                yearId: Number(yearid),
                monthId: Number(monthid),
                employeeId: employeeId.employeeId,
                employedDate: employeeId.employedDate,
                birthDate: employeeId.birthDate,
                leftDate: employeeId.leftDate,
                sexName: (employeeId.sex === 'male')? "nam" : "nữ",
                WD: new Double( totalWDSal.WD),            
                WN: new Double( totalWDSal.WN),
                totalWD: new Double( totalWDSal.totalWD),
                AL: new Double( totalWDSal.AL),
                PH: new Double( totalWDSal.PH),
                CL: new Double( totalWDSal.CL),
                KL: new Double( totalWDSal.KL),
                totalLeaveCL: new Double( totalWDSal.AL + totalWDSal.PH + totalWDSal.CL),
                totalLeaveKL: new Double( totalWDSal.KL),
                totalLeave: new Double( totalWDSal.AL + totalWDSal.PH + totalWDSal.CL + totalWDSal.KL),
                OT15: new Double( totalWDSal.OT15),
                OT20: new Double( totalWDSal.OT20),
                OT30: new Double( totalWDSal.OT30), 
                OT15N: new Double( totalWDSal.OT15N),
                OT20N: new Double( totalWDSal.OT20N),
                OT30N: new Double( totalWDSal.OT30N),
                totalOTDay: new Double(  totalWDSal.OT15 + totalWDSal.OT20 + totalWDSal.OT30),
                totalOTNight: new Double(  totalWDSal.OT15N + totalWDSal.OT20N + totalWDSal.OT30N),
                totalOT: new Double( totalWDSal.OT15 + totalWDSal.OT20 + totalWDSal.OT30 + totalWDSal.OT15N + totalWDSal.OT20N + totalWDSal.OT30N),
                // workday salary
                WDSal: new Double( totalWDSal.WDSal),            
                WNSal: new Double( totalWDSal.WNSal),
                totalWDSal: new Double( totalWDSal.totalWDSal),
                // leave salary
                ALSal: new Double( totalWDSal.ALSal),
                PHSal: new Double( totalWDSal.PHSal),
                CLSal: new Double( totalWDSal.CLSal),
                KLSal: new Double( 0),
                totalLeaveCLSal: new Double( totalWDSal.ALSal + totalWDSal.PHSal + totalWDSal.CLSal),
                totalLeaveKLSal: new Double( 0),
                totalLeaveSal: new Double( totalWDSal.ALSal + totalWDSal.PHSal + totalWDSal.CLSal),
                // overtime salary
                OT15Sal: new Double( totalWDSal.OT15Sal),
                OT20Sal: new Double( totalWDSal.OT20Sal),
                OT30Sal: new Double( totalWDSal.OT30Sal), 
                OT15NSal: new Double( totalWDSal.OT15NSal),
                OT20NSal: new Double( totalWDSal.OT20NSal),
                OT30NSal: new Double( totalWDSal.OT30NSal),
                totalOTSalDay: new Double( totalWDSal.OT15Sal + totalWDSal.OT20Sal + totalWDSal.OT30Sal),
                totalOTNight: new Double(  totalWDSal.OT15NSal + totalWDSal.OT20NSal + totalWDSal.OT30NSal),
                totalOTSal: new Double( totalWDSal.OT15Sal + totalWDSal.OT20Sal + totalWDSal.OT30Sal + totalWDSal.OT15NSal + totalWDSal.OT20NSal + totalWDSal.OT30NSal),
                // overtime salary (taxable)
                OT15SalTax: new Double( totalWDSal.OT15SalTax),
                OT20SalTax: new Double( totalWDSal.OT20SalTax),
                OT30SalTax: new Double( totalWDSal.OT30SalTax), 
                OT15NSalTax: new Double( totalWDSal.OT15NSalTax),
                OT20NSalTax: new Double( totalWDSal.OT20NSalTax),
                OT30NSalTax: new Double( totalWDSal.OT30NSalTax),
                totalOTSalTax: new Double( totalWDSal.OT15SalTax + totalWDSal.OT20SalTax + totalWDSal.OT30SalTax + totalWDSal.OT15NSalTax + totalWDSal.OT20NSalTax + totalWDSal.OT30NSalTax ),
                // allowance salary
                totalAllowanceSal: new Double( allowance.totalAllownaceSal),
                totalAllowanceTaxSal: new Double( allowance.totalAllownaceSalTax),
                // fix allowance salary
                totalAllowanceFixSal: new Double( allowanceFix.totalAllownaceFixSal),
                totalAllowanceFixTaxSal: new Double( allowanceFix.totalAllownaceFixSalTax),
                // add salary
                totalAddSal: new Double( add.totalAddDeductSal),
                totalAddTaxSal: new Double( add.totalAddDeductSalTax),
                // deduct salary
                totalDeductSal: new Double( deduct.totalAddDeductSal),
                totalDeductTaxSal: new Double( deduct.totalAddDeductSalTax),
                // employee insurance
                SI_emp: new Double( insuraceSal.SI_emp),
                HI_emp: new Double( insuraceSal.SI_emp),
                UI_emp: new Double( insuraceSal.SI_emp),
                Ins_emp_total: new Double( insuraceSal.Ins_emp_total),
                // compay insurance
                SI_comp: new Double( insuraceSal.SI_comp),
                HI_comp: new Double( insuraceSal.HI_comp),
                UI_comp: new Double( insuraceSal.UI_comp),
                Ins_comp_total: new Double( insuraceSal.Ins_comp_total ),
                totalFamilyDepen: new Double( 0),
                totalFamilyDepenSal: new Double( 0),
                // employee PIT
                dependenSeftSal: new Double( pitSal.dependenSeftSal),
                totalDepend: new Double( pitSal.totalDepend),
                dependenFamilySal: new Double( pitSal.dependenFamilySal )

            };
            // cal total salary
            listEmployeeId.totalSal = new Double(
                    listEmployeeId.totalWDSal + listEmployeeId.totalOTSal + listEmployeeId.totalLeaveSal +
                    listEmployeeId.totalOTSal + listEmployeeId.totalAllowanceSal + listEmployeeId.totalAllowanceFixSal + 
                    listEmployeeId.totalAddSal);
            // cal taxable of total salary
            listEmployeeId.totalSalTax = new Double(
                    listEmployeeId.totalWDSal + listEmployeeId.totalOTSalTax + listEmployeeId.totalAllowanceTaxSal +
                    listEmployeeId.totalAllowanceFixTaxSal + listEmployeeId.totalAddTaxSal);
            // actual taxable
            listEmployeeId.incomeTax = new Double(calTaxAg(listEmployeeId.totalSalTax - (listEmployeeId.dependenSeftSal + listEmployeeId.dependenFamilySal)));
            // take home
            listEmployeeId.takehome = new Double(listEmployeeId.totalSal - listEmployeeId.incomeTax - listEmployeeId.Ins_emp_total -
                    listEmployeeId.totalDeductSal)
            // update takehome if takehome < 0;
            listEmployeeId.takehome = new Double( (listEmployeeId.takehome < 0 )? 0 : listEmployeeId.takehome );
            listEmployeeId.takehomeRound = new Double( Math.round(listEmployeeId.takehome,0) );
          return listEmployeeId;
        }
    );
    const checkExistPayroll = await colltblpayroll.find({yearId: Number(yearid), monthId: Number(monthid)}).project({_id:0, employeeId: 1, yearId: 1, monthId: 1}).toArray();
    const payrollInsert = payroll.filter(ele => 
     ( checkExistPayroll.some(eleInner => 
         eleInner.employeeId === ele.employeeId &&
         Number(eleInner.yearId) === Number(ele.yearId) &&
         Number(eleInner.monthId) === Number(ele.monthId)
      ) === true )? false :  true
    );
    // console.log(payrollInsert);
    const respone = (payrollInsert.length > 0)? (await colltblpayroll.insertMany(payrollInsert)) : status(0,0);
    //#endregion
    return respone;
    } catch (error) {
    console.log(error);
    throw error;
    } finally{
    await connect.close();
    }
}


function getMonth(monthid,year,opt)
{
    // opt: 0 => first day of month
    // opt: 1 => last day of month
    if(![0,1].includes(opt)) return ;
    const date = (opt === 0)? (new Date(year,monthid -1,2)).toISOString() : (new Date(year,monthid,1)).toISOString();
    return date.split('T')[0];
}
// get total days of current month
function getCurrentWD(yearid, monthid)
{
  const currentWD = momentJS(getMonth(monthid,yearid,1),'YYYYMMDD').daysInMonth();
  // // get first day of month
  // let firstday = momentJS(getMonth(monthid,yearid,0),'YYYYMMDD'), lastday = momentJS(getMonth(monthid,yearid,1),'YYYYMMDD');
  // get number of saturday in this month
  let totalSat = 0;
  let firstdayWhile = momentJS(getMonth(monthid,yearid,0),'YYYYMMDD'), lastdayWhile = (momentJS(getMonth(monthid,yearid,1),'YYYYMMDD')).add(1,'day');
  while(firstdayWhile < lastdayWhile)
  {
    // saturday = 6
    totalSat += (firstdayWhile.isoWeekday() === 6)? 1: 0;
    firstdayWhile = firstdayWhile.add(1,'day');
  }
  // get number of holiday
  // soon, maybe!
  //...

  return currentWD - totalSat;
}

// get parameter
async function getPara(paraId)
{
    // paraId === '*' => get all parameter
    // get payroll's parameter
    const para = await getListParameter();
    const listPara = [...para].map(ele => ({paraId: ele.paraId, value: ele.value}));
    let result = undefined;
    if(paraId === '*')
    {
      result = [...listPara];
    }
    else{
      result = (([...listPara].filter(para => para.paraId === paraId)).length === 1)? (listPara.filter(para => para.paraId === paraId))[0].value : null;
    }
    return result;
}
// filter parameter 
function filterPara(listPara,paraId)
{
   return (([...listPara].filter(para => para.paraId === paraId)).length === 1)? (listPara.filter(para => para.paraId === paraId))[0].value : null;
}

// algorithm cal taxable

function calTaxAg(totalSalaryTax)
{
   totalSalaryTax = (!Number(totalSalaryTax))? 0 : totalSalaryTax;
   let taxIncome = (totalSalaryTax < 0 ) ? 0 : totalSalaryTax;
   const status = (totalSalaryTax <= 5000000) ? 0 : 
                  (totalSalaryTax > 5000000 && totalSalaryTax < 10000000 ) ? 1 :
                  (totalSalaryTax > 10000000 && totalSalaryTax <= 18000000 ) ? 2 :
                  (totalSalaryTax > 18000000 && totalSalaryTax <= 32000000 ) ? 3 : 
                  (totalSalaryTax > 32000000 && totalSalaryTax <= 52000000 ) ? 4 : 
                  (totalSalaryTax > 52000000 && totalSalaryTax <= 80000000 ) ? 5 :
                  (totalSalaryTax > 8000000 ) ? 6: -1;
   switch(status){
        case 0:
        taxIncome *= 0.05;
        break;
        case 1:
        taxIncome *= 0.1;
        break;
        case 2:
        taxIncome *= 0.15;
        break;
        case 3:
        taxIncome *= 0.2;
        break;
        case 4:
        taxIncome *= 0.25;
        break;
        case 5:
        taxIncome *= 0.3;
        break;
        case 6:
        taxIncome *= 0.35;
        break;
   }
   return taxIncome;
}

// algorithm cal total WD salary
async function calWDSalAg(WD,WN, basicSalary, yearid, monthid)
{
  // get default workday in month
  const WDinMonth = await getPara('CCT');
  // get current wd in this month
  const CurrentWD = getCurrentWD(yearid,monthid);
  try {
  // wd in month for cal
  const WDinMonthCal = (CurrentWD > WDinMonth)? WDinMonth :  CurrentWD;
  // cal daySal 
  const daySal = basicSalary / WDinMonthCal;
  // cal hourSal
  const hourSal = daySal / 8.0; // default 8 hours
  // cal total WD salary
  const WDSal = daySal * WD;
  // cal total WN salary
  const WNSal =(daySal * WN) + (WN * daySal * 0.3) // + 0.3 for employee whoes work at night
  // cal total WD salary
  const totalWDSal = WDSal + WNSal ;
  return {
    WDSal: WDSal,
    WNSal: WNSal,
    totalWDSal: totalWDSal
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// algorithm cal total OT salary

async function calOTSalAg(basicSalary , yearid, monthid, ...listOT)
{
  // get default workday in month
  const WDinMonth = await getPara('CCT');
  // get rare OT
  const OTr = await getPara('*');
  const OTrare ={
    OT15: filterPara(OTr,'OT15'),
    OT20: filterPara(OTr,'OT20'),
    OT30: filterPara(OTr,'OT30'),
    OT15N: filterPara(OTr,'OT15N'),
    OT20N: filterPara(OTr,'OT20N'),
    OT30N: filterPara(OTr,'OT30N')
  } ;
  // get current wd in this month
  const CurrentWD = getCurrentWD(yearid,monthid);
  try {
      // wd in month for cal
  const WDinMonthCal = (CurrentWD > WDinMonth)? WDinMonth :  CurrentWD;
  // cal daySal 
  const daySal = basicSalary / WDinMonthCal;
  // cal hourSal
  const hourSal = daySal / 8.0; // default 8 hours
  // cal OT
  const OTSal = {
    OT15Sal: listOT[0][0] * hourSal * OTrare.OT15,
    OT20Sal: listOT[0][1] * hourSal * OTrare.OT20,
    OT30Sal: listOT[0][2] * hourSal * OTrare.OT30,
    OT15NSal: listOT[0][3] * hourSal * OTrare.OT15N,
    OT20NSal: listOT[0][4] * hourSal * OTrare.OT20N,
    OT30NSal: listOT[0][5] * hourSal * OTrare.OT30N,
    // taxable
    OT15SalTax: listOT[0][0] * hourSal * 1,
    OT20SalTax: listOT[0][1] * hourSal * 1,
    OT30SalTax: listOT[0][2] * hourSal * 1,
    OT15NSalTax: listOT[0][3] * hourSal * 1,
    OT20NSalTax: listOT[0][4] * hourSal * 1,
    OT30NSalTax: listOT[0][5] * hourSal * 1,
  }

  return OTSal;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// algorithm cal total leave salary

async function calLeaveSalAg(basicSalary , yearid, monthid, ...listLeave)
{
  // get default workday in month
  const WDinMonth = await getPara('CCT');
  // get current wd in this month
  const CurrentWD = getCurrentWD(yearid,monthid);
  try {
      // wd in month for cal
  const WDinMonthCal = (CurrentWD > WDinMonth)? WDinMonth :  CurrentWD;
  // cal daySal 
  const daySal = basicSalary / WDinMonthCal;
  // cal hourSal
  const hourSal = daySal / 8.0; // default 8 hours
  // cal leave
  const LeaveSal = {
    PHSal: listLeave[0][0] * daySal,
    ALSal: listLeave[0][1] * daySal,
    CLSal: listLeave[0][2] * daySal
  }
  
  return LeaveSal;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


// algorithm cal insurance

async function calInsAg(basicSalary , yearid, monthid)
{
  // get default workday in month
  const WDinMonth = await getPara('CCT');
  // get para for insurance
  const Insrare = await getPara('*');
  const insuranceRare = {
    SI_emp: filterPara(Insrare,'SI_race_emp'),
    HI_emp: filterPara(Insrare,'HI_race_emp'),
    UI_emp: filterPara(Insrare,'UI_race_emp'),
    SI_comp: filterPara(Insrare,'SI_race_comp'),
    HI_comp: filterPara(Insrare,'HI_race_comp'),
    UI_comp: filterPara(Insrare,'UI_race_comp')
  }
  // get current wd in this month
  const CurrentWD = getCurrentWD(yearid,monthid);
  try {
      // wd in month for cal
  const WDinMonthCal = (CurrentWD > WDinMonth)? WDinMonth :  CurrentWD;
  // cal daySal 
  const daySal = basicSalary / WDinMonthCal;
  // cal hourSal
  const hourSal = daySal / 8.0; // default 8 hours
  // cal leave
  const InsuraceSal = {
    SI_empSal: basicSalary * insuranceRare.SI_emp,
    HI_empSal: basicSalary * insuranceRare.HI_emp,
    UI_empSal: basicSalary * insuranceRare.UI_emp,
    SI_compSal: basicSalary * insuranceRare.SI_comp,
    HI_compSal: basicSalary * insuranceRare.HI_comp,
    UI_compSal: basicSalary * insuranceRare.UI_comp
  };
  InsuraceSal.totalEmpIns = InsuraceSal.SI_empSal + InsuraceSal.HI_empSal + InsuraceSal.UI_empSal;
  InsuraceSal.totalCompIns = InsuraceSal.SI_compSal + InsuraceSal.HI_compSal + InsuraceSal.UI_compSal;
  
  return InsuraceSal;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// cal basicSalary 

async function calBasicSalary(monthid, yearid, listEmployeeForCal,opt)
{
     
     const connect = await mongodb.connect(connectString);
     const db = connect.db(dbName);
     // check valid opt
     // opt: 0 => original basicSalary
     // opt: 1 => basicSalary + (some allownace)
     if(!(['0','1'].includes(String(opt)))) return [...listEmployeeForCal].map(employeeId => ({employeeId: employeeId, basicSalary: 0}));
     // get tblref_allownace with IsBH = 1
     const getlistref_allowance = await db.collection('tblref_allowance').distinct('allowanceId',{IsBH: true});
     // get last of month
    const lastOfMonth = getMonth(monthid,yearid,1);
    try {
      // get list basicSalary
      const getListBasicSalary =  await (require('../salary/salaryFunction').getmaxSalary(lastOfMonth));
      // get list allowance Fix
      const getListAllowanceFix = await(require('../allowanceFix/allowanceFixFunction').getmaxAllowaneFix(lastOfMonth));
      // filter list allowance Fix with IsBH = true
      const listAllowanceFixBH = [...getListAllowanceFix].filter(ele => getlistref_allowance.includes(ele.allowanceId));
      
      // caculate data for listEmployeeForCal
      const result = [...listEmployeeForCal].map(
        employeeId =>{
          let totalBasicSalary = 0;
          let totalAllownaceFixSal = 0;
          if(String(opt) === '1')
          {
            totalAllownaceFixSal = ((listAllowanceFixBH.filter(eleInner => eleInner.employeeId === employeeId)).map(eleInner2 => eleInner2.amount)).reduce(
              (value, current) =>{
                  value += current;
                  return value;
              }
            ,0);
          }
          const listBasicSalaryFilter = ((getListBasicSalary.filter(eleInner => eleInner.employeeId === employeeId)).map(eleInner2 => eleInner2.basicSalary)).reduce(
            (value, current) =>{
                value += current;
                 return value;
            }
          ,0);
          totalBasicSalary =  Number(listBasicSalaryFilter); // Number in javascript is double, so we dont need to convert

          const curretValue = {
              employeeId: employeeId,
              basicSalary: totalBasicSalary + totalAllownaceFixSal
          }
          return curretValue;
        }
      );
    return result;
    } catch (error) {
      console.log(error);
      throw error;
    } finally{
      await connect.close();
    }
}

// cal totalWD

async function calTotalWD(monthid, yearid, listEmployeeForCal)
{
  const connect = await mongodb.connect(connectString);
  const db = connect.db(dbName);
  // get last of month
  const lastOfMonth = getMonth(monthid,yearid,1);
  try {

  // get list totalWD
  const getListTotalWD = await db.collection('tbltotalWD').find({yearId: Number(yearid), monthId: Number(monthid)}).project({_id: 0}).toArray();
  // get basicSalary
  const getListBasicSalary = await calBasicSalary(monthid,yearid,listEmployeeForCal,0);
  // algorithm caculate for work day, over time, leave
  const alg = {
    WDSal: calWDSalAg,
    OTSal: calOTSalAg,
    LeaveSal: calLeaveSalAg};

  let listEmployee = [];
  for(let employeeId of [...listEmployeeForCal])
  {
    let employeeTotalWD = {
      employeeId: employeeId,
      WD: 0,
      WDSal: 0,
      WN: 0,
      WNSal: 0,
      AL: 0,
      ALSal: 0,
      PH: 0,
      PHSal: 0,
      CL: 0,
      CLSal: 0,
      KL: 0,
      KLSal: 0,
      OT15:0,
      OT15Sal:0,
      OT20:0,
      OT20Sal:0,
      OT30:0,
      OT30Sal:0,
      OT15N:0,
      OT15NSal:0,
      OT20N:0,
      OT20NSal:0,
      OT30N:0,
      OT30NSal:0,
      totalWD: 0,
      totalWDSal: 0,
      OT15SalTax:0,
      OT20SalTax:0,
      OT30SalTax:0,
      OT15NSalTax:0,
      OT20NSalTax:0,
      OT30NSalTax:0
    }
    const getListTotalWDFilter = getListTotalWD.filter(ele => ele.employeeId === employeeId);
    const basicSalary = ([...getListBasicSalary].filter(ele => ele.employeeId === employeeId)).reduce(
      (value, current) =>{
          value += current.basicSalary;
          return value;
      }
    ,0);
    
    if(getListTotalWDFilter.length === 1)
    {
      const ele = getListTotalWDFilter[0];
      const leaveSal = await alg.LeaveSal(basicSalary,yearid,monthid,[
        (!Number(ele.AL))? 0 : ele.AL,
        (!Number(ele.PH))? 0 : ele.PH,
        (!Number(ele.CL))? 0 : ele.CL
      ]);
      
      const OTSal = await alg.OTSal(basicSalary,yearid,monthid,[ele.OT15,ele.OT20,ele.OT30,ele.OT15N,ele.OT20N,ele.OT30N]);
      const WDSal = await alg.WDSal(ele.WD,ele.WN,basicSalary,yearid,monthid);
      // workday, overtime, leave
      employeeTotalWD.WD = (!Number(ele.WD))? 0 : ele.WD;
      employeeTotalWD.WN = (!Number(ele.WN))? 0 : ele.WN;
      employeeTotalWD.AL = (!Number(ele.AL))? 0: ele.AL;
      employeeTotalWD.PH = (!Number(ele.PH))? 0: ele.PH;
      employeeTotalWD.CL = (!Number(ele.CL))? 0: ele.CL;
      employeeTotalWD.KL = (!Number(ele.KL))? 0 : ele.KL;
      employeeTotalWD.OT15 = (!Number(ele.OT15))? 0 : ele.OT15;
      employeeTotalWD.OT20 = (!Number(ele.OT20))? 0 : ele.OT20;
      employeeTotalWD.OT30 = (!Number(ele.OT30))? 0 : ele.OT30;
      employeeTotalWD.OT15N = (!Number(ele.OT15N))? 0 : ele.OT15N;
      employeeTotalWD.OT20N = (!Number(ele.OT20N))? 0 : ele.OT20N;
      employeeTotalWD.OT30N = (!Number(ele.OT30N))? 0 : ele.OT30N;
      employeeTotalWD.totalWD = (!Number(ele.totalWD))? 0 : ele.totalWD;
      // salary
      employeeTotalWD.WDSal = (!Number(ele.WD))? 0 : WDSal.WDSal;
      employeeTotalWD.WNSal = (!Number(ele.WN))? 0 : WDSal.WNSal;
      employeeTotalWD.ALSal = (!Number(leaveSal.ALSal))? 0: leaveSal.ALSal;
      employeeTotalWD.PHSal = (!Number(leaveSal.PHSal))? 0: leaveSal.PHSal;
      employeeTotalWD.CLSal = (!Number(leaveSal.CLSal))? 0: leaveSal.CLSal;
      employeeTotalWD.OT15Sal = (!Number(OTSal.OT15Sal))? 0 : OTSal.OT15Sal;
      employeeTotalWD.OT20Sal = (!Number(OTSal.OT20Sal))? 0 : OTSal.OT20Sal;
      employeeTotalWD.OT30Sal = (!Number(OTSal.OT30Sal))? 0 : OTSal.OT30Sal;
      employeeTotalWD.OT15NSal = (!Number(OTSal.OT15NSal))? 0 : OTSal.OT15NSal;
      employeeTotalWD.OT20NSal = (!Number(OTSal.OT20NSal))? 0 : OTSal.OT20NSal;
      employeeTotalWD.OT30NSal = (!Number(OTSal.OT30NSal))? 0 : OTSal.OT30NSal;
      employeeTotalWD.OT15SalTax = (!Number(OTSal.OT15SalTax))? 0 : OTSal.OT15SalTax;
      employeeTotalWD.OT20SalTax = (!Number(OTSal.OT20SalTax))? 0 : OTSal.OT20SalTax;
      employeeTotalWD.OT30SalTax = (!Number(OTSal.OT30SalTax))? 0 : OTSal.OT30SalTax;
      employeeTotalWD.OT15NSalTax = (!Number(OTSal.OT15NSalTax))? 0 : OTSal.OT15NSalTax;
      employeeTotalWD.OT20NSalTax = (!Number(OTSal.OT20NSalTax))? 0 : OTSal.OT20NSalTax;
      employeeTotalWD.OT30NSalTax = (!Number(OTSal.OT30NSalTax))? 0 : OTSal.OT30NSalTax;
      employeeTotalWD.totalWDSal = (!Number(WDSal.totalWDSal))? 0 : WDSal.totalWDSal;
    }
    listEmployee.push(employeeTotalWD);  
  }

  return listEmployee;
    
  } catch (error) {
    console.log(error);
    throw error;
  } finally{
    await connect.close();
  }
}

// cal allowance 

async function calAllowance(monthid, yearid, listEmployeeForCal)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
     // get first of month
    const firstOfMonth = getMonth(monthid,yearid,0);
     // get last of month
    const lastOfMonth = getMonth(monthid,yearid,1);
    try {
      // get list tblref_allowance Taxable
      const getlistref_allowanceTax = await db.collection('tblref_allowance').distinct('allowanceId',{IsTax: true});
      // get list allowance
      const getListAllowance = await(require('../allowance/allowanceFunction').getmaxAllowane(lastOfMonth));
      // caculate data for listEmployeeForCal
      const result = [...listEmployeeForCal].map(
        employeeId =>{
          let totalAlowance = 0, totalAllownaceTax = 0;
          const listAlowanceFilter = getListAllowance.filter(eleInner => eleInner.employeeId === employeeId 
            // dateChange must be in caculation's month
            && ( castDate(eleInner.dateChange,1) >= castDate(firstOfMonth,1) && castDate(eleInner.dateChange,1) <= castDate(lastOfMonth,1) ) );
          for(let ele of listAlowanceFilter){
            totalAlowance += Number(ele.amount); // Number in javascript is double, so we dont need to convert
            totalAllownaceTax += (getlistref_allowanceTax.includes(ele.allowanceId))? Number(ele.amount) : 0;
          }
          const curretValue = {
              employeeId: employeeId,
              totalAllownaceSal: totalAlowance,
              totalAllownaceSalTax: totalAllownaceTax // taxable
          }
          return curretValue;
        }
      );
    return result;
    } catch (error) {
      console.log(error);
      throw error;
    } finally{
      await connect.close();
    }
}


// cal allowanceFix

async function calAllowanceFix(monthid, yearid, listEmployeeForCal)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
     // get last of month
    const lastOfMonth = getMonth(monthid,yearid,1);
    try {
      // get list tblref_allowance Taxable
      const getlistref_allowanceTax = await db.collection('tblref_allowance').distinct('allowanceId',{IsTax: true});
      // get list allowanceFix
      const getListAllowanceFix = await(require('../allowanceFix/allowanceFixFunction').getmaxAllowaneFix(lastOfMonth));
      // caculate data for listEmployeeForCal
      const result = [...listEmployeeForCal].map(
        employeeId =>{
          let totalAlowanceFix = 0, totalAlowanceFixTax = 0;
          const listAlowanceFixFilter = getListAllowanceFix.filter(eleInner => eleInner.employeeId === employeeId );
          for(let ele of listAlowanceFixFilter){
            totalAlowanceFix += Number(ele.amount); // Number in javascript is double, so we dont need to convert
            totalAlowanceFixTax += (getlistref_allowanceTax.includes(ele.allowanceId))? Number(ele.amount) : 0;
          }
          const curretValue = {
              employeeId: employeeId,
              totalAllownaceFixSal: totalAlowanceFix,
              totalAllownaceFixSalTax: totalAlowanceFixTax // taxable
          }
          return curretValue;
        }
      );
    return result;
    } catch (error) {
      console.log(error);
      throw error;
    } finally{
      connect.close();
    }
}

// cal add or deduct 

async function calAddDeduct(monthid, yearid, listEmployeeForCal,ADopt)
{
    const connect = await mongodb.connect(connectString);
    const db = connect.db(dbName);
     // check valid option add or deduct
    if(!(['A','D'].includes(String(ADopt).toUpperCase()))) return [...listEmployeeForCal].map(employeeId => ({employeeId: employeeId, totalAddDeductSal: 0, totalAddDeductSalTax: 0}));
     // get first of month
    const firstOfMonth = getMonth(monthid,yearid,0);
     // get last of month
    const lastOfMonth = getMonth(monthid,yearid,1);
    try {
      // get list tblref_addDeduct Taxable
      const getlistref_AddDeduct = await db.collection('tblref_addDeduct').distinct('addDeductId',{IsTax: true});
      // get list add or deduct
      const getListAddDeduct = await (require('../addDeduct/addDeductFunction').getmaxaddDeduct(lastOfMonth,ADopt));
      // caculate data for listEmployeeForCal
      const result = [...listEmployeeForCal].map(
        employeeId =>{
          let totalAddDeduct = 0, totalAddDeductTax = 0;
          const listAddDeductFilter = getListAddDeduct.filter(eleInner => eleInner.employeeId === employeeId 
            // dateChange must be in caculation's month
            && ( castDate(eleInner.dateChange,1) >= castDate(firstOfMonth,1) && castDate(eleInner.dateChange,1) <= castDate(lastOfMonth,1) ) );
          for(let ele of listAddDeductFilter){
            totalAddDeduct += Number(ele.amount); // Number in javascript is double, so we dont need to convert
            totalAddDeductTax += (getlistref_AddDeduct.includes(ele.addDeductId))? Number(ele.amount) : 0;
          }
          const curretValue = {
              employeeId: employeeId,
              totalAddDeductSal: totalAddDeduct,
              totalAddDeductSalTax: totalAddDeductTax // taxable
          }
          return curretValue;
        }
      );
    return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
}

// cal insurance
async function calInsurance(monthid, yearid, listEmployeeForCal)
{
  try {
    // get basicSalary
    const getListBasicSalary = await calBasicSalary(monthid,yearid,listEmployeeForCal,1);
    const listEmployee = [];
    for(let employeeId of listEmployeeForCal)
    {
      const basicSalary = ([...getListBasicSalary].filter(ele => ele.employeeId === employeeId)).reduce(
        (value, current) =>{
            value += current.basicSalary;
            return value;
        }
      ,0);
      //console.log(basicSalary);
      const insurance = await calInsAg(basicSalary,yearid,monthid);
      let employeeInsurance ={
         employeeId: employeeId,
         SI_emp: insurance.SI_empSal,
         HI_emp: insurance.HI_empSal,
         UI_emp: insurance.UI_empSal,
         SI_comp: insurance.SI_compSal,
         HI_comp: insurance.HI_compSal,
         UI_comp: insurance.UI_compSal,
         Ins_emp_total: insurance.totalEmpIns,
         Ins_comp_total: insurance.totalCompIns
      }
      listEmployee.push(employeeInsurance);
    }
  return listEmployee;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// cal pit

async function calPIT(monthid, yearid, listEmployeeForCal)
{
  try {
    // get last of month
    const lastOfMonth = getMonth(monthid,yearid,1);
    // get para for PIT
    const paraRare = await getPara('*');
    const PITRare = {
    dependF: filterPara(paraRare,'PITF'),
    dependS: filterPara(paraRare,'PITS')
  }
    // get total dependend family
    const getlistDepen = await (require('../../familyDepen/familyDepenFunction').getmaxDepenFamily(lastOfMonth))
    const listEmployee = [];
    for(let employeeId of listEmployeeForCal)
    {
      const totalDepend = ([...getlistDepen].filter(ele => ele._id === employeeId)).reduce(
        (value, current) =>{
          value += current.totalDepend;
          return value;
        }
      ,0);
      //console.log(basicSalary);
      
      let employeePIT ={
         employeeId: employeeId,
         dependenSeftSal: PITRare.dependS,
         totalDepend: totalDepend,
         dependenFamilySal: PITRare.dependF * totalDepend
      }
      listEmployee.push(employeePIT);
    }
  return listEmployee;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


// get payroll

async function getPayroll(yearid,monthid,employeeid)
{
   const connect = await mongodb.connect(connectString);
   const db = connect.db(dbName);
   const tblpayroll = 'tblpayroll';
   const coll_payroll = db.collection(tblpayroll);
   try {
   const getListpayroll = await coll_payroll.aggregate([
      {
        $match:{
          $expr:{
            $and:[
                {$eq:["$yearId",Number(yearid)]},
                (monthid === '*')?'' : {$eq:["$monthId",Number(monthid)]},
                (employeeid === '*')?'' : {$eq:["$employeeId",employeeid]}
            ]
          }
        }
      },
      {
        $project:{
          _id: 0
        }
      }
   ]).toArray();
   return getListpayroll;
   } catch (error) {
   console.log(error);
   throw error;
   } finally{
   await connect.close();
   }
}

module.exports = {
    callPayroll: callPayroll,
    getPayroll: getPayroll
};
