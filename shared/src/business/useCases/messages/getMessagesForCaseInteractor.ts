import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { Message } from '../../entities/Message';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * gets messages for a case
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the message
 */
export const getMessagesForCaseInteractor: IGetMessagesForCaseInteractor =
  async (applicationContext, { docketNumber }) => {
    const authorizedUser = applicationContext.getCurrentUser();

    if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_MESSAGES)) {
      throw new UnauthorizedError('Unauthorized');
    }

    const messages = await applicationContext
      .getPersistenceGateway()
      .getMessagesByDocketNumber({
        applicationContext,
        docketNumber,
      });

    return Message.validateRawCollection(messages, {
      applicationContext,
    });
  };
