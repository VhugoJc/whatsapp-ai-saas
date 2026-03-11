/**
 * Simple Chatbot Agent with Intent Detection
 * Handles Mexican Spanish conversations for dance class business
 */

interface Intent {
  keywords: string[];
  response: string;
}

const INTENTS: Record<string, Intent> = {
  saludo: {
    keywords: ['hola', 'buenas', 'hello', 'hey', 'buenos días', 'buenas tardes', 'buenas noches'],
    response: "Hola 👋 ¿Quieres conocer nuestros horarios o precios de las clases?"
  },
  horarios: {
    keywords: ['horarios', 'horario', 'clases', 'cuando', 'días', 'schedule', 'time', 'hora'],
    response: `Las clases disponibles son:

💃 Salsa - Lunes y Miércoles 7pm
💃 Bachata - Martes y Jueves 7pm`
  },
  precios: {
    keywords: ['precio', 'precios', 'costo', 'cuanto', 'cuánto', 'mensualidad', 'pago', 'cost', 'price'],
    response: "La mensualidad cuesta $900 MXN."
  }
};

/**
 * Detect intent from user message using keyword matching
 * @param text - User's message text
 * @returns Detected intent name or null
 */
function detectIntent(text: string): string | null {
  const normalizedText = text.toLowerCase().trim();
  
  for (const [intentName, intent] of Object.entries(INTENTS)) {
    for (const keyword of intent.keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        return intentName;
      }
    }
  }
  
  return null;
}

/**
 * Process incoming message and generate appropriate response
 * @param tenantId - Business tenant identifier
 * @param phone - User's phone number
 * @param text - User's message text
 * @returns Response text to send back
 */
export function processMessage(tenantId: string, phone: string, text: string): string {
  console.log(`[Agent] Processing message from ${phone} (tenant: ${tenantId}): "${text}"`);
  
  const detectedIntent = detectIntent(text);
  
  if (detectedIntent && INTENTS[detectedIntent]) {
    const response = INTENTS[detectedIntent].response;
    console.log(`[Agent] Intent detected: ${detectedIntent}`);
    return response;
  }
  
  // Default response for unrecognized messages
  const defaultResponse = "Hola 👋 Puedo ayudarte con información sobre horarios o precios de nuestras clases de baile. ¿Qué te interesa saber?";
  console.log(`[Agent] No intent detected, using default response`);
  return defaultResponse;
}
