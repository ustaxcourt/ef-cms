import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { editPaperFilingInteractor } from '@web-api/business/useCases/docketEntry/editPaperFilingInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for editing a paper filing on a case before it is served
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const editPaperFilingLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await editPaperFilingInteractor(
      applicationContext,
      JSON.parse(event.body),
      authorizedUser,
    );
  });
