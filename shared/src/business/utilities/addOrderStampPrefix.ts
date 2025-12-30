/**
 * Adds "Order - " prefix to freeText when eventCode includes 'O' and the text doesn't already start with "Order"
 * @param {string} eventCode - The event code for the docket entry
 * @param {string} freeText - The free text to format
 * @returns {string} The formatted freeText with Order prefix if applicable
 */
export const addOrderStampPrefix = (
  eventCode: string | undefined,
  freeText: string | undefined,
): string | undefined => {
  if (eventCode?.includes('O') && freeText !== undefined) {
    return freeText.startsWith('Order') ? freeText : `Order - ${freeText}`;
  }
  return freeText;
};

