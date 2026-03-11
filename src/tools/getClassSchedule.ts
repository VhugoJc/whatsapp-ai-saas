/**
 * Get Class Schedule Tool
 * Returns general class schedules for the dance academy
 */

export interface ToolResult {
  success: boolean;
  data?: any;
  message?: string;
}

/**
 * Get the general class schedule for all dance classes
 * @param parameters - Tool parameters (not used for general schedule)
 * @returns Tool result with class schedule information
 */
export async function getClassSchedule(parameters?: any): Promise<ToolResult> {
  console.log('[Tool] getClassSchedule called');
  
  try {
    const scheduleData = {
      classes: [
        {
          name: "Salsa",
          days: ["Lunes", "Miércoles"],
          time: "7pm"
        },
        {
          name: "Bachata", 
          days: ["Martes", "Jueves"],
          time: "7pm"
        }
      ]
    };

    const formattedMessage = `Nuestros horarios son:

💃 Salsa - Lunes y Miércoles 7pm
💃 Bachata - Martes y Jueves 7pm`;

    return {
      success: true,
      data: scheduleData,
      message: formattedMessage
    };
  } catch (error) {
    console.error('[Tool] getClassSchedule error:', error);
    return {
      success: false,
      message: "Lo siento, no pude obtener los horarios en este momento."
    };
  }
}
