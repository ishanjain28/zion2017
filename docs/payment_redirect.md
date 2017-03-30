# Payment Redirect

A guest is redirected from Instamojo Payment Service after completing their payment regardless of the transaction status.

## Endpoint 

    /payment_redirect

## Request Type
    
    GET

## Query Parameters

    payment_id= A Payment ID recieved from Instamojo
    payment_request_id= A payment request id received from instamojo

## Response

### Successful Result

    {
        "payment_id": "payment_id as recieved in query parameters",
        "payment_request_id": "payment_request_id as received in query parameters"

### Fail result

#### Status Code

    400

#### Response
	
    {
        "error": 1,
        "message": "Invalid Request"
    }
