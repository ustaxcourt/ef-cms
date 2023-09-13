import { genericHandler } from '../../genericHandler';

/**
 * run the trial session planning report
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const runTrialSessionPlanningReportLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .runTrialSessionPlanningReportInteractor(applicationContext, {
          ...JSON.parse(event.body),
        });
    },
    { logResults: false },
  );
