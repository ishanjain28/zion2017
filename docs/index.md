# ZION 2017 API

# Description

This API provides works in the backend of [ZION2017](http://coerzion.com). It helps students and guests to register for student, pay the fees and Also provides a way to authorise their passes, which will be in form of QR Codes
and only allow one entry per day.

# Installation

### Tools you'll need to run this Server on your Machine

#### Necessary

   [Redis](http://redis.io)
   
   [MongoDB](http://mongodb.org)
   
   [NodeJS](http://nodejs.org) Version 6.xx

#### Optionals

   [Yarn](https://yarnpkg.com)

1. Clone the Repository

    git clone https://github.com/ishanjain28/zion2017

2. Install Dependencies

##### If you have Yarn installed, Type

    cd zion2017
    yarn

##### If you only have npm installed

    cd zion2017
    npm install

# Usage

```
npm start

Server is Live on http://localhost:5000
```


# API Reference

## [Generate Payment URL](https://ishanjain28.github.io/zion2017/generate_payment_url)
> Endpoint to create an URL for payment

## [Check Payment](https://ishanjain28.github.io/zion2017/check_payment)
> Endpoint to Check the Payment Status of a transaction 

## [Payment Redirect](https://ishanjain28.github.io/zion2017/payment_redirect)
> Endpoint that the user'll be redirected to after a transaction completes, Regardless of the result of transaction

## [Authorise Guest](https://ishanjain28.github.io/zion2017/authorise_guest)
> Endpoint to authorises the guest  

## [Submit Update](https://zion2017.github.io/zion2017/submit_update)
> Endpoint to Submit a new Status Update

## [Submit Outpass](https://ishanjain28.github.io/zion2017/updates)
> Endpoint to get all the previously submitted updates
