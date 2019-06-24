/**
 * validateForwardMessage
 * @param applicationContext
 * @param message
 * @returns {object} errors (null if no errors)
 */
exports.validateForwardMessage = ({ applicationContext, message }) => {
  return new (applicationContext.getEntityConstructors()).ForwardMessage(
    message,
  ).getFormattedValidationErrors();
};
