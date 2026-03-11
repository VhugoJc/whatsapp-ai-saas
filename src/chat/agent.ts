/**
 * Simple Chatbot Agent with Tool-Based Architecture
 * Handles Mexican Spanish conversations for dance class business
 */

import { findTool, executeTool } from '../tools/registry';

/**
 * Detect greeting intent from user message
 * @param text - User's message text
 * @returns True if greeting detected
 */
function isGreeting(text: string): boolean {
  const greetingKeywords = ['hola', 'buenas', 'hello', 'hey', 'buenos días', 'buenas tardes', 'buenas noches'];
  const normalizedText = text.toLowerCase().trim();
  
  return greetingKeywords.some(keyword => 
    normalizedText.includes(keyword.toLowerCase())
  );
}

/**
 * Process incoming message and generate appropriate response
 * @param tenantId - Business tenant identifier
 * @param phone - User's phone number
 * @param text - User's message text
 * @returns Response text to send back
 */
export async function processMessage(tenantId: string, phone: string, text: string): Promise<string> {
  console.log(`[Agent] Processing message from ${phone} (tenant: ${tenantId}): "${text}"`);
  
  // Check for greeting first
  if (isGreeting(text)) {
    console.log(`[Agent] Greeting detected`);
    return "Hola 👋 ¿Quieres conocer nuestros horarios o precios de las clases?";
  }
  
  // Try to find and execute a tool
  const toolName = findTool(text);
  
  if (toolName) {
    console.log(`[Agent] Tool found: ${toolName}`);
    try {
      const result = await executeTool(toolName);
      
      if (result.success && result.message) {
        console.log(`[Agent] Tool executed successfully: ${toolName}`);
        return result.message;
      } else {
        console.error(`[Agent] Tool execution failed: ${toolName}`, result.message);
        return result.message || "Lo siento, ocurrió un error al procesar tu solicitud.";
      }
    } catch (error) {
      console.error(`[Agent] Tool execution error:`, error);
      return "Lo siento, ocurrió un error al procesar tu solicitud.";
    }
  }
  
  // Try FAQ search as fallback for unmatched queries
  console.log(`[Agent] No specific tool found, trying FAQ search`);
  try {
    const faqResult = await executeTool('search_faq', { query: text });
    
    if (faqResult.success && faqResult.message) {
      console.log(`[Agent] FAQ search completed`);
      return faqResult.message;
    }
  } catch (error) {
    console.error(`[Agent] FAQ search error:`, error);
  }
  
  // Default response for completely unrecognized messages
  const defaultResponse = "Hola 👋 Puedo ayudarte con información sobre horarios, precios, o responder preguntas frecuentes sobre las clases. ¿Qué te interesa saber?";
  console.log(`[Agent] Using final default response`);
  return defaultResponse;
}
