import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { generateDraftStampOrderInteractor } from '@shared/business/useCases/generateDraftStampOrderInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * used for generating a draft stamp order
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const generateDraftStampOrderLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      await generateDraftStampOrderInteractor(
        applicationContext,
        {
          ...event.pathParameters,
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
