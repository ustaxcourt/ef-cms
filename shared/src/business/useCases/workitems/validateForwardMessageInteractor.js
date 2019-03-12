/**
 * validateForwardMessage
 * @param applicationContext
 * @param message
 * @returns {Object} errors (null if no errors)
 */
exports.validateForwardMessage = ({ message, applicationContext }) => {
  return new (applicationContext.getEntityConstructors()).ForwardMessage(
    message,
  ).getFormattedValidationErrors();
};
