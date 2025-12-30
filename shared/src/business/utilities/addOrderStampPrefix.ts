/**
 * Adds "Order - " prefix to text when eventCode includes 'O' and the text doesn't already start with "Order"
 * @param {string} eventCode - The event code for the docket entry
 * @param {string} text - The free text to format
 * @returns {string} The formatted text with Order prefix if applicable
 */
export const addOrderStampPrefix = (
  eventCode: string | undefined,
  text: string | undefined,
): string | undefined => {
  if (eventCode?.includes('O') && text !== undefined) {
    return text.startsWith('Order') ? text : `Order - ${text}`;
  }
  return text;
};

