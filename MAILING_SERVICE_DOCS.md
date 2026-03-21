# Mailing Agent Service Documentation

A production-ready microservice for sending transactional emails via Brevo.

## 🚀 Deployment on Render

1. **Create a New Web Service**:
   - Connect your GitHub repository.
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server/index.js` (or `npx ts-node src/server/index.ts` for quick start)

2. **Environment Variables**:
   Add the following in the Render Dashboard:
   - `PORT`: `10000`
   - `SERVICE_API_KEY`: Your secret key (e.g., `my-secure-key-123`)
   - `BREVO_API_KEY`: Your Brevo API v3 key.
   - `DEFAULT_SENDER_EMAIL`: A verified email in your Brevo account.
   - `DEFAULT_SENDER_NAME`: Your application name.

## 📘 API Reference

### Base URL
`https://your-service-name.onrender.com`

### Authentication
All requests must include the following header:
`x-api-key: YOUR_SERVICE_API_KEY`

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
    "email": "verified@yourdomain.com",
    "name": "Custom Sender"
  },
  "cc": ["manager@example.com"],
  "attachments": [
    {
      "name": "invoice.pdf",
      "content": "JVBERi0xLjQKJ..." 
    }
  ]
}
```

### Example Requests

#### JavaScript (Fetch)
```javascript
const response = await fetch('https://your-service.onrender.com/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_SERVICE_API_KEY'
  },
  body: JSON.stringify({
    to: ['user@example.com'],
    subject: 'Test Email',
    html: '<p>Hello World</p>'
  })
});
const data = await response.json();
```

#### Python (Requests)
```python
import requests

url = "https://your-service.onrender.com/send-email"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "YOUR_SERVICE_API_KEY"
}
payload = {
    "to": ["user@example.com"],
    "subject": "Test Email",
    "html": "<p>Hello World</p>"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

## 🔐 Security
- **API Key Auth**: Custom middleware ensures only authorized clients can send emails.
- **Rate Limiting**: Prevents abuse by limiting requests per IP.
- **Input Validation**: Zod ensures all payloads are correctly formatted before hitting Brevo.
- **Helmet**: Adds security headers to the Express app.

## 📧 Verifying Senders in Brevo
1. Log in to Brevo.
2. Go to **Senders & IP**.
3. Click **Add a sender**.
4. Enter the email address and verify it via the link sent to that inbox.
5. Only verified emails can be used in the `from` field or as `DEFAULT_SENDER_EMAIL`.