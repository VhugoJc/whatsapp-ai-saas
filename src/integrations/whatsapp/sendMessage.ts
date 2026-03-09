/**
 * WhatsApp Cloud API Integration
 * Handles sending messages via WhatsApp Graph API
 */

interface WhatsAppMessage {
  messaging_product: 'whatsapp';
  to: string;
  text: {
    body: string;
  };
}

/**
 * Send a template message via WhatsApp Cloud API (for first contact)
 * @param phone - Phone number in international format
 * @param templateName - Name of approved template
 * @returns Promise with API response or error
 */
export async function sendWhatsappTemplate(phone: string, templateName: string = 'hello_world'): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '';
  
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    return { success: false, error: 'Missing WhatsApp configuration' };
  }

  const message: WhatsAppMessage = {
    messaging_product: 'whatsapp',
    to: phone,
    template: {
      name: templateName,
      language: {
        code: 'es_MX' // Spanish (Mexico)
      }
    }
  };

  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  
  try {
    console.log(`[WhatsApp] Sending template "${templateName}" to ${phone}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[WhatsApp] Template API error (${response.status}):`, errorText);
      return { success: false, error: `API error: ${response.status} ${errorText}` };
    }

    const result: WhatsAppApiResponse = await response.json();
    const messageId = result.messages?.[0]?.id;
    
    console.log(`[WhatsApp] Template sent successfully - ID: ${messageId}`);
    
    return { success: true, messageId };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[WhatsApp] Error sending template:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

interface WhatsAppApiResponse {
  messaging_product: string;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

/**
 * Send a text message via WhatsApp Cloud API
 * @param phone - Phone number in international format (e.g., "5214441234567")
 * @param text - Text message to send
 * @returns Promise with API response or error
 */
export async function sendWhatsappMessage(phone: string, text: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || ''; // WhatsApp Business Account Phone Number ID
  
  if (!WHATSAPP_TOKEN) {
    console.error('[WhatsApp] Missing WHATSAPP_TOKEN environment variable');
    return { success: false, error: 'Missing WhatsApp token configuration' };
  }

  if (!PHONE_NUMBER_ID) {
    console.error('[WhatsApp] Missing PHONE_NUMBER_ID environment variable');
    return { success: false, error: 'Missing Phone Number ID configuration' };
  }

  const message: WhatsAppMessage = {
    messaging_product: 'whatsapp',
    to: phone,
    text: {
      body: text
    }
  };

  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  
  try {
    console.log(`[WhatsApp] Sending message to ${phone}: "${text}"`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[WhatsApp] API error (${response.status}):`, errorText);
      return { success: false, error: `API error: ${response.status} ${errorText}` };
    }

    const result: WhatsAppApiResponse = await response.json();
    const messageId = result.messages?.[0]?.id;
    
    console.log(`[WhatsApp] Message sent successfully - ID: ${messageId}`);
    
    return { success: true, messageId };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[WhatsApp] Error sending message:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
