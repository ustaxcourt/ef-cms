const { NewCaseMessage } = require('../../entities/NewCaseMessage');

/**
 * validateCreateCaseMessageInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.message the message data
 * @returns {object} errors (null if no errors)
 */
exports.validateCreateCaseMessageInteractor = ({
  applicationContext,
  message,
}) => {
  return new NewCaseMessage(message, {
    applicationContext,
  }).getFormattedValidationErrors();
};
