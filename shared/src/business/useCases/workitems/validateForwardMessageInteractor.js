/**
 * validateForwardMessage
 * @param applicationContext
 * @param message
 * @returns {object} errors (null if no errors)
 */
exports.validateForwardMessage = ({ message, applicationContext }) => {
  return new (applicationContext.getEntityConstructors()).ForwardMessage(
    message,
  ).getFormattedValidationErrors();
};
