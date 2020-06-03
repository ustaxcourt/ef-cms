const { CaseMessage } = require('../../entities/CaseMessage');

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
  return new CaseMessage(message, {
    applicationContext,
  }).getFormattedValidationErrors();
};
