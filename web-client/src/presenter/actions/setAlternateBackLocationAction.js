import { state } from 'cerebral';

/**
 * sets an alternateBackLocation based on props
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} alternate props
 *
 */

export const setAlternateBackLocationAction = ({ props, store }) => {
  const { caseId, isTrialSessionCalendared, trialSession } = props;

  console.log('caseId', caseId);
  console.log('isTrialSessionCalendared', isTrialSessionCalendared);
  console.log('trialSession', trialSession);
  if (caseId && isTrialSessionCalendared) {
    store.set(state.screenMetadata.backLocation, `/case-detail/${caseId}`);
  } else {
    store.set(
      state.screenMetadata.backLocation,
      `/trial-session-detail/${trialSession.trialSessionId}`,
    );
  }
};
