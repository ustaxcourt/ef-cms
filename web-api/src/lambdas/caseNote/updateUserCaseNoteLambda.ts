import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateUserCaseNoteInteractor } from '@web-api/business/useCases/caseNote/updateUserCaseNoteInteractor';

/**
 * used for updating a judge's case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateUserCaseNoteLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const lambdaArguments = {
      ...event.pathParameters,
      ...JSON.parse(event.body),
    };

    return await updateUserCaseNoteInteractor(
      applicationContext,
      {
        ...lambdaArguments,
      },
      authorizedUser,
    );
  });
