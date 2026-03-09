import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

/**
 * WhatsApp Cloud API Webhook Payload Interfaces
 */
interface WhatsAppTextMessage {
  body: string;
}

interface WhatsAppMessage {
  from: string;
  text?: WhatsAppTextMessage;
  type?: string;
}

interface WhatsAppValue {
  messages?: WhatsAppMessage[];
  contacts?: any[];
  metadata?: any;
}

interface WhatsAppChange {
  value: WhatsAppValue;
  field: string;
}

interface WhatsAppEntry {
  id: string;
  changes: WhatsAppChange[];
}

interface WhatsAppWebhookPayload {
  object?: string;
  entry?: WhatsAppEntry[];
}

/**
 * Extract phone number and message text from WhatsApp Cloud API payload
 */
function extractWhatsAppData(payload: WhatsAppWebhookPayload): { phone: string | null; messageText: string | null } {
  try {
    // Navigate through the nested payload structure
    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message) {
      console.log('[WhatsApp] No message found in payload');
      return { phone: null, messageText: null };
    }

    const phone = message.from || null;
    const messageText = message.text?.body || null;

    console.log(`[WhatsApp] Message extracted - Phone: ${phone}, Text: "${messageText}", Type: ${message.type || 'text'}`);

    return { phone, messageText };
  } catch (error) {
    console.error('[WhatsApp] Error extracting data:', error instanceof Error ? error.message : 'Unknown error');
    return { phone: null, messageText: null };
  }
}

/**
 * WhatsApp Webhook Handler
 * Handles HTTP POST requests from WhatsApp Cloud API webhook
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const requestId = context.awsRequestId;
  const timestamp = new Date().toISOString();
  
  console.log(`[REQUEST] ${requestId} - ${event.httpMethod} ${event.path} - ${timestamp}`);

  try {
    // Validate HTTP method
    if (event.httpMethod !== 'POST') {
      console.log(`[ERROR] ${requestId} - Invalid HTTP method: ${event.httpMethod}`);
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          error: 'Method not allowed',
          message: 'Only POST requests are supported'
        })
      };
    }

    // Parse the request body
    let payload: WhatsAppWebhookPayload = {};
    if (event.body) {
      try {
        payload = JSON.parse(event.body);
        console.log(`[PAYLOAD] ${requestId} - Received WhatsApp payload`);
      } catch (parseError) {
        console.error(`[ERROR] ${requestId} - Failed to parse JSON:`, parseError instanceof Error ? parseError.message : 'Unknown parse error');
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            error: 'Invalid JSON payload',
            message: 'Request body must be valid JSON'
          })
        };
      }
    } else {
      console.log(`[PAYLOAD] ${requestId} - Empty request body`);
    }

    // Extract phone number and message text
    const { phone, messageText } = extractWhatsAppData(payload);

    // Log the result
    if (phone && messageText) {
      console.log(`[SUCCESS] ${requestId} - WhatsApp message processed: ${phone} -> "${messageText}"`);
    } else {
      console.log(`[INFO] ${requestId} - No WhatsApp message data found in payload`);
    }

    console.log(`[RESPONSE] ${requestId} - Returning 200 OK`);

    // Return successful response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        message: 'Bot running',
        timestamp,
        requestId,
        processed: {
          phone,
          messageText,
          hasMessage: !!(phone && messageText)
        }
      })
    };

  } catch (error) {
    // Log error details
    console.error(`[ERROR] ${requestId} - Unexpected error:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp
    });

    // Return error response
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'An error occurred while processing the request',
        requestId
      })
    };
  }
};
