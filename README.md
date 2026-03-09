# WhatsApp AI SaaS - Serverless Project

A minimal Node.js + TypeScript serverless project using AWS Lambda and API Gateway for WhatsApp integration.

## Features

- **Runtime**: Node.js 18.x
- **Language**: TypeScript
- **Framework**: Serverless Framework
- **Local Development**: Serverless Offline
- **AWS Services**: Lambda + API Gateway

## Project Structure

```
whatsapp-ai-saas/
├── src/
│   └── handlers/
│       └── whatsappWebhook.ts    # Main webhook handler
├── package.json
├── serverless.yml               # Serverless configuration
├── tsconfig.json               # TypeScript configuration
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Serverless CLI globally (if not already installed):
```bash
npm install -g serverless
```

## Local Development

Run the Lambda function locally:
```bash
npm start
```

This will start the serverless offline server on `http://localhost:3000`.

## Testing with Postman

### Endpoint URL
```
POST http://localhost:3000/dev/webhook
```

### Headers
```
Content-Type: application/json
```

### Test Payload (WhatsApp Cloud API format)
```json
{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "5214441234567",
          "text": { "body": "hola" },
          "type": "text"
        }]
      }
    }]
  }]
}
```

### Expected Response
```json
{
  "message": "Bot running",
  "timestamp": "2026-03-08T...",
  "requestId": "...",
  "processed": {
    "phone": "5214441234567",
    "messageText": "hola",
    "hasMessage": true
  }
}
```

## WhatsApp Cloud API Integration

The webhook handler now supports WhatsApp Cloud API webhook payloads and extracts:

### Extracted Data
- **Phone Number**: User's phone number (from field)
- **Message Text**: Text content of the message
- **Message Type**: Type of message (text, image, etc.)

### Payload Format
```json
{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "5214441234567",
          "text": { "body": "hola" },
          "type": "text"
        }]
      }
    }]
  }]
}
```

### Logging Output
When a WhatsApp message is received, you'll see logs like:
```
📱 WhatsApp Message Extracted:
  Phone Number: 5214441234567
  Message Text: hola
  Message Type: text

🎯 WhatsApp Data Successfully Extracted:
📞 Phone: 5214441234567
💬 Message: hola
```

## API Endpoint

- **URL**: `POST /webhook`
- **Response**: 
  - Status Code: `200`
  - Body: `"Bot running"` (with additional metadata)

## Scripts

- `npm run build` - Compile TypeScript
- `npm start` - Run locally with serverless offline
- `npm run deploy` - Deploy to AWS
- `npm run logs` - View CloudWatch logs

## Deployment

To deploy to AWS:

1. Configure AWS credentials
2. Run: `npm run deploy`

## Environment Variables

Set in `serverless.yml` under `provider.environment`:
- `NODE_ENV`: Current stage (dev/prod)

## Logging

The handler includes comprehensive logging for:
- Incoming requests
- Successful processing
- Error handling
- Request metadata
