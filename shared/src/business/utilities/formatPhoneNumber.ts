/**
 * formats a 10-digit phone number with hyphens
 *
 * @param {string} phone the phone number to format
 * @returns {string|void} the formatted string
 */
export const formatPhoneNumber = function (phone) {
  if (!phone) return;

  if (phone.match(/^\d{10}$/)) {
    const parts = phone.match(/^(\d{3})(\d{3})(\d{4})$/);
    phone = `${parts[1]}-${parts[2]}-${parts[3]}`;
  }

  return phone;
};

/**
 * formats a 10-digit phone number for trial notices with area code in parentheses
 *
 * @param {string} phone the phone number to format
 * @returns {string|void} the formatted string
 */
export const formatTrialNoticePhoneNumber = function (
  phone?: string,
): string | undefined {
  if (!phone) return;

  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }

  return phone;
};
