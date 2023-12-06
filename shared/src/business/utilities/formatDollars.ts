/**
 * formats a number with a dollar sign, commas, and 2 decimal places
 *
 * @param {number} number the number to format
 * @returns {string} the formatted string
 */
export const formatDollars = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
}).format;
