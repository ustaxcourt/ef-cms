import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCompletedMessagesForSectionInteractor } from '@web-api/business/useCases/messages/getCompletedMessagesForSectionInteractor';

/**
 * gets the completed messages for the section
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCompletedMessagesForSectionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getCompletedMessagesForSectionInteractor(
      applicationContext,
      {
        section: event.pathParameters.section,
      },
      authorizedUser,
    );
  });
