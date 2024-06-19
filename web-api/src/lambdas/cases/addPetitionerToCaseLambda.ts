import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addPetitionerToCaseInteractor } from '@shared/business/useCases/addPetitionerToCaseInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for adding a petitioner to a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const addPetitionerToCaseLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await addPetitionerToCaseInteractor(
        applicationContext,
        {
          ...event.pathParameters,
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
