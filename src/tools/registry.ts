/**
 * Tool Registry
 * Centralized registry for all available tools
 */

import { getClassSchedule } from './getClassSchedule';
import { getPrices } from './getPrices';
import { searchFAQ } from './searchFAQ';
import { ToolResult } from './types';

export interface Tool {
  name: string;
  description: string;
  keywords: string[];
  execute: (parameters?: any) => Promise<ToolResult>;
}

/**
 * Registry of all available tools
 */
export const TOOL_REGISTRY: Record<string, Tool> = {
  get_class_schedule: {
    name: 'get_class_schedule',
    description: 'Get general class schedules for all dance classes',
    keywords: ['horarios', 'horario', 'clases', 'cuando', 'días', 'schedule', 'time', 'hora'],
    execute: getClassSchedule
  },
  get_prices: {
    name: 'get_prices', 
    description: 'Get pricing information for dance classes',
    keywords: ['precio', 'precios', 'costo', 'cuanto', 'cuánto', 'mensualidad', 'pago', 'cost', 'price'],
    execute: getPrices
  },
  search_faq: {
    name: 'search_faq',
    description: 'Search frequently asked questions database',
    keywords: [], // No keywords - this tool is used as fallback
    execute: searchFAQ
  }
};

/**
 * Find the appropriate tool based on user message
 * @param text - User's message text
 * @returns Tool name or null if no tool matches
 */
export function findTool(text: string): string | null {
  const normalizedText = text.toLowerCase().trim();
  
  for (const [toolName, tool] of Object.entries(TOOL_REGISTRY)) {
    for (const keyword of tool.keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        return toolName;
      }
    }
  }
  
  return null;
}

/**
 * Execute a tool by name
 * @param toolName - Name of the tool to execute
 * @param parameters - Parameters to pass to the tool
 * @returns Tool execution result
 */
export async function executeTool(toolName: string, parameters?: any): Promise<ToolResult> {
  const tool = TOOL_REGISTRY[toolName];
  
  if (!tool) {
    return {
      success: false,
      message: `Tool '${toolName}' not found`
    };
  }
  
  console.log(`[Registry] Executing tool: ${toolName}`);
  return await tool.execute(parameters);
}

/**
 * Get all available tools
 * @returns Array of all registered tools
 */
export function getAllTools(): Tool[] {
  return Object.values(TOOL_REGISTRY);
}
