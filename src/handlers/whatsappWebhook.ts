import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

/**
 * WhatsApp Webhook Handler
 * Handles HTTP POST requests to the webhook endpoint
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // Log the incoming request for debugging
  console.log('WhatsApp Webhook - Incoming request:', {
    httpMethod: event.httpMethod,
    path: event.path,
    headers: event.headers,
    body: event.body,
    requestId: context.awsRequestId,
    timestamp: new Date().toISOString()
  });

  try {
    // Validate HTTP method
    if (event.httpMethod !== 'POST') {
      console.log('Invalid HTTP method:', event.httpMethod);
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

    // Log successful webhook processing
    console.log('WhatsApp Webhook - Processing successful:', {
      requestId: context.awsRequestId,
      timestamp: new Date().toISOString(),
      status: 'Bot running'
    });

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
        timestamp: new Date().toISOString(),
        requestId: context.awsRequestId
      })
    };

  } catch (error) {
    // Log error details
    console.error('WhatsApp Webhook - Error occurred:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      requestId: context.awsRequestId,
      timestamp: new Date().toISOString()
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
        requestId: context.awsRequestId
      })
    };
  }
};
