/**
 * formats a number as money with a dollar sign, commas, and 2 decimal places
 *
 * @param {number} number the number to format as money
 * @returns {string} the formatted string
 */
export const formatMoney = number => {
  const formatter = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  });

  return formatter.format(number);
};
