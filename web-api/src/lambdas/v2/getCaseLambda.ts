import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCaseInteractor } from '@shared/business/useCases/getCaseInteractor';
import { marshallCase } from './marshallers/marshallCase';
import { v2ApiWrapper } from './v2ApiWrapper';

/**
 * used for fetching a single case and returning it in v1 api format
 *
 * @param {object} event the AWS event object
 * @param {object} options options to optionally pass to the genericHandler
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseLambda = (
  event,
  authorizedUser: UnknownAuthUser,
  options, // TODO 10417 Remove all instances of passing in options via lambda params
) =>
  genericHandler(
    event,
    ({ applicationContext }) =>
      v2ApiWrapper(async () => {
        const caseObject = await getCaseInteractor(
          applicationContext,
          {
            docketNumber: event.pathParameters.docketNumber,
          },
          authorizedUser,
        );

        return marshallCase(caseObject);
      }),
    options,
  );
