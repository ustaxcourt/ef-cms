import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getPrivatePractitionersBySearchKeyInteractor } from '@web-api/business/useCases/user/getPrivatePractitionersBySearchKeyInteractor';

/**
 * gets practitioner users by a search string (name or bar number)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPrivatePractitionersBySearchKeyLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { searchKey } = event.queryStringParameters;

    return await getPrivatePractitionersBySearchKeyInteractor(
      applicationContext,
      {
        searchKey,
      },
      authorizedUser,
    );
  });
