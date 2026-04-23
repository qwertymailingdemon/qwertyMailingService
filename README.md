## 📘 API Reference


### Base URL
`https://qwertymailingservice.onrender.com` 
this is my render deployed app, if you need mailing api please contact 'qwertymailingdemon@gmail.com'
or you can simply clone this repo and replace with create a .env similar to the .env.exaple and replace with you actual credentials and use your base url for api calls

###Note this backed service is used by my projects and ai agents for mailing, and many times the mail received might be in promotions or spam based on the context it is being used as this is not specified for particular context, and brevo mailing is used hence it mostly considers the mails received from this api to be a promotion as breavo is mostly used for bulk marketting

### Authentication
All requests must include the following header:
`x-api-key: YOUR_SERVICE_API_KEY`
I will give this key in .env keep place holders


---


### POST /send-email


Sends a transactional email.


**Headers:**
- `Content-Type: application/json`
- `x-api-key: YOUR_SERVICE_API_KEY`


**Request Body:**
```json
{
  "to": ["recipient@example.com"],
  "subject": "Hello from Mailing Agent",
  "html": "<h1>Welcome!</h1><p>This is a test email.</p>",
  "from": {
    "email": "verified@yourdomain.com", //there is a default sender if this is not used hence don’t use this and let it handle by default sender
    "name": "Custom Sender"
  }
}
```
