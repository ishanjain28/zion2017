# Generate Payment URL

## Endpoint

    /generate_payment_url

## Request Type

    POST

## Headers

    "Content-Type": "application/x-www-form-urlencoded"

## Body

    {
	"email": "Guest Email"
	"name": "Guest Name"
	"amount": "Transaction Amount"
	"phoneno": "Guest Phone number"
    }

## Responses

### If Invalid Data is provided

    {
	"error": 1,
	"message": "Invalid Data"
    }

### If Server Fails to store user data in Database

#### Status Code 

    400

#### Response
    
    {
	"error": 1,
	"message": "Bad Request"
    }	

### If Server fails to generate payment url

#### Status Code

    400

#### Response

    {
	"error": 1,
	"message": "Failed to generate url. Please retry after some time."
    }


### If everything goes correctly

    {
	"error": 0,
	"data": {
		"payment_url": "Payment URL",
                "payment_request_id": "Payment Request ID",
                "email": "Guest Email",
                "name": "Guest Name",
                "phone": "Guest Phoneno",
                "amount": "Guest Amount",
                "status": "Transaction Status"
         }
    }
