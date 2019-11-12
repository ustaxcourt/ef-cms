/**
 * validateForwardMessageInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.message the message data
 * @returns {object} errors (null if no errors)
 */
exports.validateForwardMessageInteractor = ({
  applicationContext,
  message,
}) => {
  return new (applicationContext.getEntityConstructors().ForwardMessage)(
    message,
  ).getFormattedValidationErrors();
};
