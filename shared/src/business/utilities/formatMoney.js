/**
 * formats a number as money with a dollar sign, commas, and 2 decimal places
 *
 * @param {number} number the number to format as money
 * @returns {string} the formatted string
 */
export const formatMoney = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
}).format;
