/**
 * validateInitialWorkItemMessage
 * @param applicationContext
 * @param message
 * @returns {object} errors (null if no errors)
 */
exports.validateInitialWorkItemMessage = ({ applicationContext, message }) => {
  return new (applicationContext.getEntityConstructors()).InitialWorkItemMessage(
    message,
  ).getFormattedValidationErrors();
};
