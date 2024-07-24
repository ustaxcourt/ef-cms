import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { removePetitionerAndUpdateCaptionInteractor } from '@shared/business/useCases/removePetitionerAndUpdateCaptionInteractor';

/**
 * lambda which is used for removing a petitioner from a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const removePetitionerAndUpdateCaptionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await removePetitionerAndUpdateCaptionInteractor(
      applicationContext,
      {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
