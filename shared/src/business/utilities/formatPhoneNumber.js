/**
 * formats a 10-digit phone number with hyphens
 *
 * @param {string} phone the phone number to format
 * @returns {string} the formatted string
 */
exports.formatPhoneNumber = function (phone) {
  if (!phone) return;

  if (phone.match(/^\d{10}$/)) {
    const parts = phone.match(/^(\d{3})(\d{3})(\d{4})$/);
    phone = `${parts[1]}-${parts[2]}-${parts[3]}`;
  }

  return phone;
};
