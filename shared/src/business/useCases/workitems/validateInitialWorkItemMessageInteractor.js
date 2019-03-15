/**
 * validateInitialWorkItemMessage
 * @param applicationContext
 * @param message
 * @returns {Object} errors (null if no errors)
 */
exports.validateInitialWorkItemMessage = ({ message, applicationContext }) => {
  return new (applicationContext.getEntityConstructors()).InitialWorkItemMessage(
    message,
  ).getFormattedValidationErrors();
};
