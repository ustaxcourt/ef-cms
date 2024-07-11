import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { saveCaseNoteInteractor } from '@web-api/business/useCases/caseNote/saveCaseNoteInteractor';

/**
 * used for saving a case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const saveCaseNoteLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const lambdaArguments = {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      };

      return await saveCaseNoteInteractor(
        applicationContext,
        {
          ...lambdaArguments,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
