import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getUserCaseNoteForCasesInteractor } from '@web-api/business/useCases/caseNote/getUserCaseNoteForCasesInteractor';

/**
 * used for fetching a judge's case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getUserCaseNoteForCasesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getUserCaseNoteForCasesInteractor(
      applicationContext,
      {
        docketNumbers: JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
