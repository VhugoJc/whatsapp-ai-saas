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

## Multi-Tenant Support

The system now supports multiple businesses with their own WhatsApp phone numbers. Each tenant is identified by their WhatsApp Phone Number ID.

### Tenant Resolution

The webhook automatically:
1. **Extracts** `metadata.phone_number_id` from WhatsApp webhooks
2. **Resolves** the tenant using `resolveTenant(phoneNumberId)`
3. **Logs** tenant information in all operations

### Tenant Configuration

Tenants are configured in `src/tenants/resolveTenant.ts`:

```typescript
const TENANT_MAP: Record<string, TenantConfig> = {
  "991146037420595": {
    tenantId: "academy_main", 
    businessName: "Academia Principal"
  },
  // Add more tenants...
};
```

### Log Output Example

```
[Tenant] Resolved tenant: academy_main (Academia Principal) for phone ID: 991146037420595
[SUCCESS] WhatsApp message processed: 5214441234567 -> "Hola..." [Tenant: academy_main]
[WhatsApp] Sending auto-reply to 5214441234567 for tenant: academy_main
```

### Adding New Tenants

1. Get the WhatsApp Phone Number ID from Facebook Developer Console
2. Add mapping to `TENANT_MAP` in `resolveTenant.ts`
3. Configure tenant-specific settings as needed

### Tenant Management Functions

- `resolveTenant(phoneNumberId)` - Get tenant by phone number ID
- `getAllTenants()` - Get all configured tenants
- `addTenant(phoneNumberId, config)` - Add new tenant dynamically
- `removeTenant(phoneNumberId)` - Remove tenant mapping

## WhatsApp Cloud API Integration

The webhook handler now supports WhatsApp Cloud API webhook payloads and automatically sends replies in Spanish.

### Auto-Reply Feature
When a user sends a message, the bot automatically responds with:
```
"Hola 👋 soy el asistente de la academia. ¿En qué puedo ayudarte?"
```

### Environment Variables
Set these environment variables for WhatsApp integration:

```bash
# WhatsApp Business Account Access Token
WHATSAPP_TOKEN=your_whatsapp_access_token_here

# Phone Number ID from WhatsApp Business Account  
PHONE_NUMBER_ID=your_phone_number_id_here
```

### Getting WhatsApp Credentials

1. **Facebook Developer Console**: Go to [developers.facebook.com](https://developers.facebook.com)
2. **Create App**: Create a new app with WhatsApp product
3. **WhatsApp Setup**: Configure WhatsApp Business Account
4. **Get Credentials**:
   - `WHATSAPP_TOKEN`: Found in WhatsApp > API Setup > Access Token
   - `PHONE_NUMBER_ID`: Found in WhatsApp > API Setup > Phone Number ID

### Local Development Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your WhatsApp credentials:
```bash
WHATSAPP_TOKEN=your_actual_token
PHONE_NUMBER_ID=your_actual_phone_number_id
```

### Integration Module

The WhatsApp integration is located at:
- `src/integrations/whatsapp/sendMessage.ts`

This module provides:
- `sendWhatsappMessage(phone: string, text: string)` function
- Error handling and logging
- Automatic retry capabilities

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
