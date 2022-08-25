import { NewMessage } from '../../entities/NewMessage';

/**
 * validateCreateMessageInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.message the message data
 * @returns {object} errors (null if no errors)
 */
export const validateCreateMessageInteractor: IValidateCreateMessageInteractor =
  (applicationContext, { message }) => {
    return new NewMessage(message, {
      applicationContext,
    }).getFormattedValidationErrors();
  };
