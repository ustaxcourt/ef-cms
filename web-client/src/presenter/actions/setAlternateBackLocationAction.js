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
  const { caseId, isTrialSessionCalendared } = props;

  if (caseId && isTrialSessionCalendared) {
    store.set(state.screenMetadata.backLocation, `/case-detail/${caseId}`);
  }
};
