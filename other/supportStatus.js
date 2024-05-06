function statusCRUD(rows, opt) {
    let status = {};
    //opt = 0 => insert
    //opt = 1 => update
    if(![0,1,2].includes(opt)) throw new Error(`incorrect opt input`)
    switch (opt) {
        case 0:
            status = {
                status: 0,
                statusName: `${rows} rows Inserted successfully!`
            };
            break;
        case 1:
            status = {
                status: 1,
                statusName: `${rows} rows updated successfully!`
            };
            break;
        case 2:
            status = {
                status: 2,
                statusName: `${rows} rows deleted successfully!`
            };
            break;
        default:
            break;
    }
    return status;
};
 
function statusLogin(opt, account = null)
{
    let status = undefined;
    if(![0,1,2].includes(opt)) throw new Error(`incorrect opt input`)

    /*
     status =>
        0: current account is not exists
        1: user or password is not correct
        2: login successfully!
    */
    switch(opt)
    {
        case 0:
            status = new Error(`this account is not exists, please check again!`);
        break;
        case 1:
            status = new Error(`user or password is not correct, please check again!`);
        break;
        case 2:
            status = {
                status: "login successfully!",
                accountInfo: {
                    accountId: account.accountId,
                    accountName: account.accountName,
                    email: account.email,
                    atoken: account.atoken
                }
            };
        break;
    }
    return status;
}

function statusRequest(opt)
{
    let status = undefined;
    if(![0,1,2].includes(opt)) return new Error(`incorrect opt unput`)

    /*
    status =>
        0: req.body is not an Array, please check again!
    */
    switch(opt){
        case 0:
            status = new Error(`req.body is not an Array! please check again`);
        break;
    }
}


module.exports = {
    status: statusCRUD,
    statusLogin: statusLogin,
    statusRequest: statusRequest
};