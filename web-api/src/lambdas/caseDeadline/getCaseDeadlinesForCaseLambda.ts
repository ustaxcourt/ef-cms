import { genericHandler } from '../../genericHandler';
import { getCaseDeadlinesForCaseInteractor } from '@web-api/business/useCases/caseDeadline/getCaseDeadlinesForCaseInteractor';

/**
 * get case deadlines for case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseDeadlinesForCaseLambda = event =>
  genericHandler(event, async () => {
    return await getCaseDeadlinesForCaseInteractor({
      docketNumber: event.pathParameters.docketNumber,
    });
  });
