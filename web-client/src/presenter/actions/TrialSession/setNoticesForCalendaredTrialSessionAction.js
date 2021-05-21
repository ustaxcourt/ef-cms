import { state } from 'cerebral';

/**
 * calls proxy endpoint to generate notices for the given trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based upon if there was any paper service or all electronic service
 */
export const setNoticesForCalendaredTrialSessionAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const trialSessionId =
    props.trialSessionId || get(state.trialSession.trialSessionId);
  const { docketNumber } = props;

  await applicationContext
    .getUseCases()
    .setNoticesForCalendaredTrialSessionInteractor(applicationContext, {
      docketNumber,
      trialSessionId,
    });
};
