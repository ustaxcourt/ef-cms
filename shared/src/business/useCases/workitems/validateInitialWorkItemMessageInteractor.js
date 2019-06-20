/**
 * validateInitialWorkItemMessage
 * @param applicationContext
 * @param message
 * @returns {object} errors (null if no errors)
 */
exports.validateInitialWorkItemMessage = ({ message, applicationContext }) => {
  return new (applicationContext.getEntityConstructors()).InitialWorkItemMessage(
    message,
  ).getFormattedValidationErrors();
};
