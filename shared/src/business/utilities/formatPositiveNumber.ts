/**
 * formats a number with commas
 *
 * @param {number} number the number to format
 * @returns {string} the formatted string
 */
export const formatPositiveNumber = (number: number) =>
  new Intl.NumberFormat('en-US', { signDisplay: 'never' }).format(number);
