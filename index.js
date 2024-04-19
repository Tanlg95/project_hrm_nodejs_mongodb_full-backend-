require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./router/router');


app.use(cors());

app.get('/',(req,res) => {
    res.json({
        author:"tanlg95",
        status: "success!!"
    })
});
app.use(express.json());
app.use(router);


const port = process.env.PORT_SERVER || 3333;
app.listen(port,() => console.log(`server is runnig at port ${port}`))