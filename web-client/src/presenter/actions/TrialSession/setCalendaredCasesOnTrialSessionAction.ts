import { state } from 'cerebral';

/**
 * sets the state.trialSession.calendaredCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.calendaredCases
 * @param {object} providers.store the cerebral store used for setting the state.calendaredCases
 */
export const setCalendaredCasesOnTrialSessionAction = ({ props, store }) => {
  store.set(state.trialSession.calendaredCases, props.calendaredCases);
};
