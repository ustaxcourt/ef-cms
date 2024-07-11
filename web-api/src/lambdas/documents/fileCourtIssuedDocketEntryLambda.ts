import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { fileCourtIssuedDocketEntryInteractor } from '@web-api/business/useCases/docketEntry/fileCourtIssuedDocketEntryInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for adding a court issued docket entry
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const fileCourtIssuedDocketEntryLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await fileCourtIssuedDocketEntryInteractor(
        applicationContext,
        {
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
