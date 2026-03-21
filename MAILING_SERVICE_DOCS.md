# Mailing Agent Service Documentation

A production-ready microservice for sending transactional emails via Brevo.

## 💻 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build the Project**:
   This compiles both the frontend and the backend server.
   ```bash
   npm run build
   ```

3. **Start the Service**:
   ```bash
   npm start
   ```

## 🚀 Deployment on Render

1. **Create a New Web Service**:
   - Connect your GitHub repository.
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

2. **Environment Variables**:
   Add the following in the Render Dashboard:
   - `PORT`: `10000`
   - `SERVICE_API_KEY`: Your secret key (e.g., `my-secure-key-123`)
   - `BREVO_API_KEY`: Your Brevo API v3 key.
   - `DEFAULT_SENDER_EMAIL`: A verified email in your Brevo account.
   - `DEFAULT_SENDER_NAME`: Your application name.

## 📘 API Reference

### Base URL
`https://your-service-name.onrender.com` (or `http://localhost:10000` locally)

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
  }
}
```

## 🔐 Security
- **API Key Auth**: Custom middleware ensures only authorized clients can send emails.
- **Rate Limiting**: Prevents abuse by limiting requests per IP.
- **Input Validation**: Zod ensures all payloads are correctly formatted.