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

## Testing

Test the webhook endpoint with a POST request:

```bash
curl -X POST http://localhost:3000/dev/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
```

Expected response:
```json
{
  "message": "Bot running",
  "timestamp": "2026-03-08T...",
  "requestId": "..."
}
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
