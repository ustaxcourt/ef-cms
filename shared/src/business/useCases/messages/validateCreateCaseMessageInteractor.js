const { NewMessage } = require('../../entities/NewMessage');

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
  return new NewMessage(message, {
    applicationContext,
  }).getFormattedValidationErrors();
};
