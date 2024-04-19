function status(rows, opt) {
    let status = {};
    //opt = 0 => insert
    //opt = 1 => update
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

module.exports = {
    status: status
};