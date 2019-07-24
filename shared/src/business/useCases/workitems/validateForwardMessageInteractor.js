/**
 * validateForwardMessageInteractor
 * @param applicationContext
 * @param message
 * @returns {object} errors (null if no errors)
 */
exports.validateForwardMessageInteractor = ({
  applicationContext,
  message,
}) => {
  return new (applicationContext.getEntityConstructors()).ForwardMessage(
    message,
  ).getFormattedValidationErrors();
};
