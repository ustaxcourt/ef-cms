/**
 * set trial session calendar
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the trialSession with cases
 */
export const setTrialSessionCalendarAction = async ({
  applicationContext,
  props,
}) => {
  const trialSessionId = props.trialSessionId;

  const trialSession = await applicationContext
    .getUseCases()
    .setTrialSessionCalendar({
      applicationContext,
      trialSessionId,
    });

  return { trialSession };
};
