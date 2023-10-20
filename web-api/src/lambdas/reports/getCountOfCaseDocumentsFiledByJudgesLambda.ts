import { APIGatewayProxyEvent } from 'aws-lambda';
import { genericHandler } from '../../genericHandler';

/**
 * gets the count of cases documents filed by judge for their activity report
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCountOfCaseDocumentsFiledByJudgesLambda = (
  event: APIGatewayProxyEvent,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCountOfCaseDocumentsFiledByJudgesInteractor(
        applicationContext,
        event.queryStringParameters,
      );
  });
