/**
 * Search FAQ Tool
 * Searches through FAQ database to find relevant answers
 */

import { searchFAQs } from '../repositories/faqRepo';
import { ToolResult } from './types';

/**
 * Search FAQ database for relevant answers
 * @param parameters - Tool parameters containing the search query
 * @returns Tool result with FAQ search results
 */
export async function searchFAQ(parameters?: { query?: string }): Promise<ToolResult> {
  const query = parameters?.query || '';
  console.log(`[Tool] searchFAQ called with query: "${query}"`);
  
  try {
    if (!query.trim()) {
      return {
        success: true,
        message: "Hola 👋 Puedo ayudarte con información sobre horarios, precios, o responder preguntas frecuentes. ¿Qué te interesa saber?"
      };
    }

    const results = searchFAQs(query);
    
    if (results.length === 0) {
      return {
        success: true,
        data: { results: [], query },
        message: "No encontré información específica sobre eso. ¿Te puedo ayudar con horarios, precios, o alguna pregunta sobre las clases?"
      };
    }

    // Return the best match (first result after sorting by relevance)
    const bestMatch = results[0];
    console.log(`[Tool] FAQ match found: ${bestMatch.question}`);
    
    // Format response with question and answer
    const formattedMessage = `${bestMatch.question}

${bestMatch.answer}`;

    return {
      success: true,
      data: { 
        results,
        bestMatch,
        query
      },
      message: formattedMessage
    };
    
  } catch (error) {
    console.error('[Tool] searchFAQ error:', error);
    return {
      success: false,
      message: "Lo siento, no pude buscar en las preguntas frecuentes en este momento."
    };
  }
}
