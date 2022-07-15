const mysql = require('mysql');
const express = require('express');
const moment = require('moment');

//var AWS = require('aws-sdk');
//var s3 = new AWS.S3({accessKeyId:'XXXXXXXXXXXX', secretAccessKey:'YYYYYYYYYYYY', region:'REGION'});

const connection = mysql.createConnection({
    user: "root",
    host: "localhost",
    port: "3306",
    password: "password",
    database: "test"
});
const app = express();

app.get('/workouts', function (req, res) {
    // Connecting to the database.
    const apiParams = [];
    apiParams.push(req.query.status);

    connection.query('SELECT * FROM WORKOUT_SERIES WHERE status = ?;', apiParams, function (error, results, fields) {
      if (error) throw error;
      res.send(results)
    });
});

app.get('/user_progress', function (req, res) {
    // Connecting to the database.
    const apiParams = [];
    apiParams.push(req.query.userid);

    connection.query('SELECT * FROM USER_PROGRESS WHERE userid = ? AND deleted = "N";', apiParams, function (error, results, fields) {
      if (error) throw error;
      res.send(results)
    });
});

app.get('/user_series_progress', function (req, res) {
    // Connecting to the database.
    const apiParams = [];
    apiParams.push(req.query.series);
    apiParams.push(req.query.userid);


    connection.query('SELECT * FROM USER_PROGRESS WHERE series = ? and userid = ? AND deleted = "N";', apiParams, function (error, results, fields) {
      if (error) throw error;
      res.send(results)
    });
});


app.get('/user_progress_update', function (req, res) {

    const apiParams = [];
    apiParams.push(req.query.userid);
    apiParams.push(req.query.series);
    apiParams.push(req.query.status);
    const dateSelected = moment();
    apiParams.push(dateSelected.format("YYYY-MM-DD HH:mm:ss"));
    apiParams.push(dateSelected.format("YYYY-MM-DD HH:mm:ss"));

    connection.query('INSERT INTO USER_PROGRESS VALUES (default, ?, ?, ?, "{}", ?, ?, "N");', apiParams, function (error, results, fields) {
      if (error) throw error;
      res.send(results)
    });
});

app.get('/user_progress_reset', function (req, res) {

    const apiParams = [];
    apiParams.push(req.query.series);
    apiParams.push(req.query.userid);

    connection.query('UPDATE USER_PROGRESS SET deleted = "Y" WHERE series = ? and userid = ?;', apiParams, function (error, results, fields) {
      if (error) throw error;
      res.send(results)
    });
});

app.get('/user_progress_delete', function (req, res) {

    const apiParams = [];
    apiParams.push(req.query.logid);
    apiParams.push(req.query.userid);

    connection.query('UPDATE USER_PROGRESS SET deleted = "Y" WHERE logid = ? and userid = ?;', apiParams, function (error, results, fields) {
      if (error) throw error;
      res.send(results)
    });
});
//user_progress_date
app.get('/user_progress_date', function (req, res) {

    const start = new Date(req.query.created);
    const apiParams = [];
    apiParams.push(req.query.userid);
    apiParams.push(start);

    connection.query(`SELECT * FROM USER_PROGRESS WHERE userid = ? AND DATE_FORMAT(created, "%m-%d-%Y") = DATE_FORMAT(?, "%m-%d-%Y") AND deleted = "N";`, apiParams, function (error, results, fields) {
      if (error) throw error;
      res.send(results)
    });
});

// sign-in-with-apple endpoint
const appleSignin = require('apple-signin-auth');
const crypto = require('crypto')
app.get('/sign-in-with-apple', async function (req, res, next) {

let nonce = 'Qmk8zaDCKoxTIMQQrNbVeBweacxL53gb'
console.log(nonce)
crypto.createHash('sha256').update(nonce).digest('hex');
console.log(nonce)
return nonce;
});

// Starting our server.
app.listen(3000, () => {
 console.log('Go to http://localhost:3000/user_progress so you can see the data.');
});
