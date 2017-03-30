# Authorise Guest

## Endpoint 

    /authorise_guest

This Endpoint is used to authorise the guest and prevents the same QR code from being used multiple times.

## Request Type

    POST

## Headers

    "Content-Type": "application/x-www-form-urlencoded"

## Parameters Required

     {
	"email": "Guest Email"
	"zionid": "ZION ID"
     }

## Responses

### If an error Occurs on server

#### Status Code

    400

#### Response

    {
	"error": 1,
	"message": "Error Occurred in fetching guests record, Please retry"
    }

### If Invalid Data is provided

#### Status Code

    400

#### Response

    {
	"error": 1,
	"message": "Invalid Data"
    }


### Authorisation Failed

#### Response

    {
	"error": 0,
	"authorised": 0,
	"zionid": zionid
    }

### Authorisation Succeeded

#### Response

    {
	"error": 0,
	"authorised": 1,
	"zionid": zionid
    }



