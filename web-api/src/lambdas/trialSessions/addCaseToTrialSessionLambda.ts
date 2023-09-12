import { genericHandler } from '../../genericHandler';

/**
 * lambda for adding a case to a trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const addCaseToTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { docketNumber, trialSessionId } = event.pathParameters || event.path;
    const { calendarNotes } = JSON.parse(event.body);

    return await applicationContext
      .getUseCases()
      .addCaseToTrialSessionInteractor(applicationContext, {
        calendarNotes,
        docketNumber,
        trialSessionId,
      });
  });
