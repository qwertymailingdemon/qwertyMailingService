# 📧 qwerty-developers Mailing Service

A high-performance, transactional mailing API with built-in anti-sleep protection and RFC-compliant unsubscribe headers.

## 🔗 Base URL
`https://qwertymailingservice.onrender.com`

## 🔐 Authentication
All requests must include the following header:
`x-api-key: YOUR_SERVICE_API_KEY`

---

## 🚀 Minimum Implementation (JavaScript/Fetch)

```javascript
const sendEmail = async () => {
  const response = await fetch('https://qwertymailingservice.onrender.com/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_SERVICE_API_KEY'
    },
    body: JSON.stringify({
      to: ['recipient@example.com'],
      subject: 'Hello World',
      html: '<h1>Test Email</h1><p>Sent via qwerty-developers.</p>'
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

---

## 🛠 API Reference: `POST /send-email`

### Required Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `to` | `string[]` | An array of recipient email addresses. |
| `subject` | `string` | The subject line of the email. |
| `html` | `string` | The HTML content of the email body. |

### Optional Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `from` | `object` | `{ email: string, name?: string }`. Defaults to `qwerty-developers`. |
| `cc` | `string[]` | Array of emails to carbon copy. |
| `bcc` | `string[]` | Array of emails to blind carbon copy. |
| `replyTo` | `string` | Email address for replies. |
| `attachments` | `object[]` | `[{ name: string, content: string }]`. Content must be **Base64 encoded**. |

---

## 📋 Exact Requirements for Use
1. **Service API Key**: You must have the secret key configured in the environment variables of the deployed service.
2. **Brevo API Key**: The service requires a valid Brevo (Sendinblue) API v3 key with **Transactional** features enabled.
3. **Verified Sender**: The `DEFAULT_SENDER_EMAIL` must be a verified sender in the associated Brevo account.
4. **Content-Type**: Always send requests with `application/json`.

## 💡 Pro Tips
- **Anti-Sleep**: The service pings itself every 40 seconds. If you are using Render's free tier, the first request after a long period of inactivity might still take ~30 seconds to respond as the instance boots up.
- **Unsubscribe**: A standard unsubscribe footer is automatically appended to your HTML if it doesn't already contain the word "Unsubscribe".