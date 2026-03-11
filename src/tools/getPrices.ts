/**
 * Get Prices Tool
 * Returns pricing information for dance classes
 */

import { ToolResult } from './types';

/**
 * Get pricing information for dance classes
 * @param parameters - Tool parameters (not used for general pricing)
 * @returns Tool result with pricing information
 */
export async function getPrices(parameters?: any): Promise<ToolResult> {
  console.log('[Tool] getPrices called');
  
  try {
    const pricingData = {
      monthly: {
        amount: 900,
        currency: "MXN",
        description: "Mensualidad completa"
      }
    };

    const formattedMessage = "La mensualidad cuesta $900 MXN.";

    return {
      success: true,
      data: pricingData,
      message: formattedMessage
    };
  } catch (error) {
    console.error('[Tool] getPrices error:', error);
    return {
      success: false,
      message: "Lo siento, no pude obtener la información de precios en este momento."
    };
  }
}
