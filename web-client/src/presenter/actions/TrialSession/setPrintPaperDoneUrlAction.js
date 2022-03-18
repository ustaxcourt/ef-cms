import { state } from 'cerebral';

/**
 * sets the printPaperDoneUrl onto the state used for knowing where to redirect when pressing done on the PrintPaperService component.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.eligibleCases
 * @param {object} providers.props the cerebral props passed from the sequences
 * @returns {void}
 */
export const setPrintPaperDoneUrlAction = ({ props, store }) => {
  let urlToRedirectTo = '/trial-sessions';
  if (props.trialSessionId) {
    urlToRedirectTo = `/trial-session-detail/${props.trialSessionId}`;
  }
  store.set(state.printPaperDoneUrl, urlToRedirectTo);
};
