const express = require('express');
const fs = require('fs');
const app = express();
const csv = require('csvtojson');
var data = "";

app.use((req, res, next) => {
// write your logging code here
    var agent = req.headers['user-agent'].replace(",","");
    var time = new Date().toISOString();
    var method = req.method;
    var resource = req.originalUrl;
    var version = `HTTP/${req.httpVersion}`;
    var status = res.statusCode;
    
    data = `\n${agent},${time},${method},${resource},${version},${status}`

    fs.appendFile('log.csv', data, (err) => {
        if(err) throw err;
    });

    next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    console.log(data);
    res.status(200).send("ok");
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    csv()
        .fromFile('log.csv')
        .then( function(jsonArrayObj) {
                res.send(jsonArrayObj);
        });
});

module.exports = app;
