/**
 * formats a number with commas
 *
 * @param {number} number the number to format
 * @returns {string} the formatted string
 */
export const formatNumber = (number: number) =>
  new Intl.NumberFormat('en-US').format(number);
