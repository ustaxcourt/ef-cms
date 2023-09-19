import { genericHandler } from '../../genericHandler';
import { marshallCase } from './marshallers/marshallCase';
import { v1ApiWrapper } from './v1ApiWrapper';

/**
 * used for fetching a single case and returning it in v1 api format
 *
 * @param {object} event the AWS event object
 * @param {object} options options to optionally pass to the genericHandler
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseLambda = (event, options) =>
  genericHandler(
    event,
    ({ applicationContext }) =>
      v1ApiWrapper(async () => {
        const caseObject = await applicationContext
          .getUseCases()
          .getCaseInteractor(applicationContext, {
            docketNumber: event.pathParameters.docketNumber,
          });

        return marshallCase(caseObject);
      }),
    options,
  );
