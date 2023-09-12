import { genericHandler } from '../../genericHandler';

/**
 * creates a new trial session.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const setForHearingLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { docketNumber, trialSessionId } =
      event.pathParameters || event.path || {};
    const { calendarNotes } = JSON.parse(event.body);

    return await applicationContext
      .getUseCases()
      .setForHearingInteractor(applicationContext, {
        calendarNotes,
        docketNumber,
        trialSessionId,
      });
  });
