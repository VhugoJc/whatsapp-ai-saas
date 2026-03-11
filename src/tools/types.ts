/**
 * Shared Types for Tools
 * Common interfaces used across the tool system
 */

export interface ToolResult {
  success: boolean;
  data?: any;
  message?: string;
}

export interface ToolParameters {
  [key: string]: any;
}
