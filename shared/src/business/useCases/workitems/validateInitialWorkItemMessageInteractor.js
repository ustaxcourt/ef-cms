const {
  InitialWorkItemMessage,
} = require('../../entities/InitialWorkItemMessage');

/**
 * validateInitialWorkItemMessageInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.message the message data
 * @returns {object} errors (null if no errors)
 */
exports.validateInitialWorkItemMessageInteractor = ({
  applicationContext,
  message,
}) => {
  return new InitialWorkItemMessage(message, {
    applicationContext,
  }).getFormattedValidationErrors();
};
