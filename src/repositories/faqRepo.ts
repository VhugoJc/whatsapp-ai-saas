/**
 * FAQ Repository
 * In-memory dataset for frequently asked questions
 */

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

/**
 * In-memory FAQ dataset
 */
const FAQ_DATA: FAQ[] = [
  {
    id: 'need_partner',
    question: '¿Necesito pareja?',
    answer: 'No es necesario venir con pareja.',
    keywords: ['pareja', 'partner', 'acompañante', 'solo', 'sola', 'necesito', 'traer']
  },
  {
    id: 'what_to_wear',
    question: '¿Qué ropa debo usar?',
    answer: 'Ropa cómoda y zapatos con suela lisa.',
    keywords: ['ropa', 'vestir', 'usar', 'zapatos', 'outfit', 'vestimenta', 'qué me pongo', 'clothes']
  },
  {
    id: 'experience_level',
    question: '¿Necesito experiencia previa?',
    answer: 'No necesitas experiencia previa. Nuestras clases están diseñadas para todos los niveles.',
    keywords: ['experiencia', 'principiante', 'novato', 'nivel', 'beginner', 'saber', 'aprender']
  },
  {
    id: 'trial_class',
    question: '¿Puedo tomar una clase de prueba?',
    answer: 'Sí, ofrecemos una clase de prueba gratuita para nuevos estudiantes.',
    keywords: ['prueba', 'trial', 'gratis', 'primera', 'nuevo', 'probar', 'test']
  },
  {
    id: 'payment_methods',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos efectivo, tarjeta de débito, crédito y transferencias bancarias.',
    keywords: ['pago', 'payment', 'tarjeta', 'efectivo', 'transferencia', 'como pagar', 'métodos']
  }
];

/**
 * Search FAQs by keywords
 * @param query - User's search query
 * @returns Array of matching FAQs
 */
export function searchFAQs(query: string): FAQ[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return [];
  }
  
  const matches = FAQ_DATA.filter(faq => {
    // Check if query matches any keyword
    const keywordMatch = faq.keywords.some(keyword => 
      normalizedQuery.includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(normalizedQuery)
    );
    
    // Check if query matches question text (partial matching)
    const questionMatch = faq.question.toLowerCase().includes(normalizedQuery) ||
      normalizedQuery.includes(faq.question.toLowerCase());
    
    // Check if query matches answer text (partial matching)  
    const answerMatch = faq.answer.toLowerCase().includes(normalizedQuery) ||
      normalizedQuery.includes(faq.answer.toLowerCase());
    
    return keywordMatch || questionMatch || answerMatch;
  });

  // Sort by relevance (number of keyword matches + length similarity)
  return matches.sort((a, b) => {
    const aMatches = a.keywords.filter(keyword => 
      normalizedQuery.includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(normalizedQuery)
    ).length;
    const bMatches = b.keywords.filter(keyword => 
      normalizedQuery.includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(normalizedQuery)
    ).length;
    
    if (aMatches !== bMatches) {
      return bMatches - aMatches;
    }
    
    // Secondary sort by question length (shorter questions = more specific)
    return a.question.length - b.question.length;
  });
}

/**
 * Get all FAQs
 * @returns All available FAQs
 */
export function getAllFAQs(): FAQ[] {
  return [...FAQ_DATA];
}

/**
 * Get FAQ by ID
 * @param id - FAQ identifier
 * @returns FAQ or null if not found
 */
export function getFAQById(id: string): FAQ | null {
  return FAQ_DATA.find(faq => faq.id === id) || null;
}

/**
 * Add a new FAQ (for future extensibility)
 * @param faq - FAQ to add
 */
export function addFAQ(faq: Omit<FAQ, 'id'>): FAQ {
  const newFAQ: FAQ = {
    ...faq,
    id: `faq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  
  FAQ_DATA.push(newFAQ);
  return newFAQ;
}
