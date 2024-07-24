import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getIrsPractitionersBySearchKeyInteractor } from '@web-api/business/useCases/user/getIrsPractitionersBySearchKeyInteractor';

/**
 * gets irsPractitioner users by a search string (name or bar number)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getIrsPractitionersBySearchKeyLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { searchKey } = event.queryStringParameters;

    return await getIrsPractitionersBySearchKeyInteractor(
      applicationContext,
      {
        searchKey,
      },
      authorizedUser,
    );
  });
