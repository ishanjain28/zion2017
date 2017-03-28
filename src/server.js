// Configure .env
require('dotenv').config();

const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  chalk = require('chalk'),
  mongo = require('mongodb'),
  Insta = require('instamojo-nodejs'), {randomBytes} = require('crypto'),
  app = express(),
  MClient = mongo.MongoClient,
  PORT = process.env.PORT || 5000,
  INSTA_API_KEY = process.env.INSTA_API_KEY,
  INSTA_AUTH_KEY = process.env.INSTA_AUTH_KEY,
  MONGODB_URL = process.env.MONGODB_URI || "mongodb://localhost:27017/zion17";

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
        res.send(JSON.stringify({
          error: 0,
          data: {
            payment_url: response.payment_request.longurl,
            email: email,
            name: name,
            phone: phoneno,
            amount: amount
          }
        }))
      } else {
        res.send(JSON.stringify({error: 1, code: 400, message: "Failed to generate url. Please retry after some time."}))
      }
    }
  })
});

app.get('/payment_status', (req, res) => {
  if (req.query && req.query.payment_id && req.query.payment_request_id) {
    res.send(JSON.stringify({payment_id: req.query.payment_id, payment_request_id: req.query.payment_request_id}));
  } else {
    res
      .status(400)
      .write(JSON.stringify({error: 1, message: 'Invalid Request'}));

    res.end();
  };
});

app.get('/check_payment', (req, res) => {
  const db = req.app.locals.db,
    guestsList = db.collection('guestsList');
  if (req.query && req.query.payment_id && req.query.payment_request_id) {
    guestsList.findOne({
      payment_id: req.query.payment_id,
      payment_request_id: req.query.payment_request_id
    }, (err, doc) => {
      if (err) {
        res.send(JSON.stringify({error: 1, message: "Internal Server Error, Please retry"}));
        throw err;
      }
      console.log(doc)
      if (doc) {
        res.send(JSON.stringify({error: 0, code: 'PAID', message: 'Paid'}))
      } else {
        res.send(JSON.stringify({error: 1, code: 'NOTPAID', message: 'Not Paid'}))
      }
    });
  } else {
    res
      .status(400)
      .write(JSON.stringify({error: 1, message: 'Bad Request. Please provide valid data'}));
    res.end();  
  }
});

app.post('/payment_webhook', (req, res) => {
  const db = req.app.locals.db,
    guestsList = db.collection('guestsList'), {
      amount,
      buyer_name,
      buyer,
      buyer_phone,
      fees,
      payment_id,
      payment_request_id,
      shorturl,
      status
    } = req.body;

  let _id = "zion" + randomBytes(3).toString('hex');
  guestsList.insertOne({
    _id: _id,
    amount: amount,
    email: buyer,
    name: buyer_name,
    fees: fees,
    payment_id: payment_id,
    payment_request_id: payment_request_id,
    payment_status: status,
    shorturl: shorturl,
    phone: buyer_phone
  }, (err, result) => {
    if (err) {
      throw err;
    } else {

      if (result.result.ok && result.nInserted) {
        res.send(JSON.stringify({error: 0, message: 'Successfully stored'}))
      } else {
        console.log({
          _id: _id,
          amount: amount,
          email: buyer,
          name: buyer_name,
          fees: fees,
          payment_id: payment_id,
          payment_request_id: payment_request_id,
          payment_status: status,
          shorturl: shorturl,
          phone: buyer_phone
        });
        res.send(JSON.stringify({error: 1, message: 'Error occurred in storing data in databases'}))
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
