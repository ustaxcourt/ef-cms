import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCaseInteractor } from '@shared/business/useCases/getCaseInteractor';
import { marshallCase } from './marshallers/marshallCase';
import { v1ApiWrapper } from './v1ApiWrapper';

/**
 * used for fetching a single case and returning it in v1 api format
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, ({ applicationContext }) =>
    v1ApiWrapper(async () => {
      const caseObject = await getCaseInteractor(
        applicationContext,
        {
          docketNumber: event.pathParameters.docketNumber,
        },
        authorizedUser,
      );

      return marshallCase(caseObject);
    }),
  );
