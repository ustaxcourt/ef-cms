/**
 * validateInitialWorkItemMessageInteractor
 * @param applicationContext
 * @param message
 * @returns {object} errors (null if no errors)
 */
exports.validateInitialWorkItemMessageInteractor = ({
  applicationContext,
  message,
}) => {
  return new (applicationContext.getEntityConstructors()).InitialWorkItemMessage(
    message,
  ).getFormattedValidationErrors();
};
