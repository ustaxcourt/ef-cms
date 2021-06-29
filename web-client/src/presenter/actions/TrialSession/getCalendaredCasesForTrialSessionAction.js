/**
 * get calendared cases for trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} contains the calendared cases for a trial sessions
 */
export const getCalendaredCasesForTrialSessionAction = async ({
  applicationContext,
  props,
}) => {
  const { trialSessionId } = props;

  const calendaredCases = await applicationContext
    .getUseCases()
    .getCalendaredCasesForTrialSessionInteractor(applicationContext, {
      trialSessionId,
    });

  return { calendaredCases };
};
