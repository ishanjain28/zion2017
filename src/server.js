// Configure .env
require('dotenv').config();

const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  chalk = require('chalk'),
  mongo = require('mongodb'),
  Insta = require('instamojo-nodejs'),
  app = express(),
  MClient = mongo.MongoClient,
  PORT = process.env.PORT || 5000,
  INSTA_API_KEY = process.env.INSTA_API_KEY,
  INSTA_AUTH_KEY = process.env.INSTA_AUTH_KEY,
  MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017";

// POST body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Disable X-Powered-by
app.disable('x-powered-by');

// Set Instamojo keys
Insta.setKeys(INSTA_API_KEY, INSTA_AUTH_KEY);
// Enable Sandbox Mode
Insta.isSandboxMode(true);

// Establish connection to mongodb
MClient.connect(MONGODB_URL, (err, db) => {
  if (err) {
    throw err;
  } else {
    app.locals.db = db;
  }
});

app.post('/generate_request_url',
// Validation Middleware
(req, res, next) => {
  if (req.body && req.body.name && req.body.phoneno && req.body.email && req.body.amount) {
    next();
  } else {
    res.send(JSON.stringify({error: 1, message: "Invalid Data"}))
  }
},
// Generates Payment URL
(req, res, next) => {
  let db = req.app.locals.db,
    transactionsList = db.collection('transactionList');

  const {email, name, phoneno, amount} = req.body;
  let req_data = new Insta.PaymentData();
  req_data.email = email;
  req_data.purpose = "ZION 2017 Registration Fee";
  req_data.amount = amount;
  req_data.buyer_name = name;
  req_data.phone = phoneno;
  req_data.send_sms = 'False';
  req_data.send_email = 'False';
  req_data.setRedirectUrl(`http://zion17.herokuapp.com/payment_status`);
  req_data.webhook = `http://zion17.herokuapp.com/payment_webhook`;
  req_data.allow_repeated_payments = false;

  Insta.createPayment(req_data, (error, resp) => {
    if (error) {
      console.error(error);
    } else {
      let response = JSON.parse(resp);
      if (response.success) {
        transactionsList.insertOne({
          name: name,
          amount: amount,
          email: email,
          phoneno: phoneno
        }, (err, result) => {
          if (err) {
            // Serious trouble.
            throw err;
          } else {
            if (result.insertedCount && result.result.ok) {
              res.send(JSON.stringify({
                error: 0,
                data: {
                  payment_url: response.payment_request.longurl,
                  email: email
                }
              }))
            } else {
              res.send(JSON.stringify({error: 1, message: "Interal Server Error, Please retry after some time."}))
            }
          }
        });
      } else {
        res.send(JSON.stringify({error: 1, code: 400, message: "Failed to generate url. Please retry after some time."}))
      }
    }
  })
});

app.listen(PORT, (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.log(chalk.red(`The PORT ${PORT} is already occupied by some other process.
Please Change PORT or stop the process using that port and then restart`));
    process.exit(1);
  } else if (err) {
    console.log('akdjakljd')
    // Something terrible happened! throw err;
  } else {
    console.log(`${chalk.green(`Server successfully started on PORT ${PORT}`)}\nBring it on!`)
  }
})