import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getPractitionersByNameInteractor } from '@web-api/business/useCases/practitioner/getPractitionersByNameInteractor';

/**
 * gets practitioner users by a search string (name or bar number)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPractitionersByNameLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { name, searchAfter } = event.queryStringParameters;

    return await getPractitionersByNameInteractor(
      applicationContext,
      {
        name,
        searchAfter,
      },
      authorizedUser,
    );
  });
