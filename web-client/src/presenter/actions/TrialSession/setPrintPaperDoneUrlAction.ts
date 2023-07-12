import { state } from 'cerebral';

/**
 * sets the the printPaperDoneUrl on state so that the PrintPaperService component knows
 * where to redirect users when they click the Done button.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.printPaperDoneUrl
 * @param {object} providers.props the cerebral props passed from the sequences
 * @returns {void}
 */
export const setPrintPaperDoneUrlAction = ({ props, store }: ActionProps) => {
  let urlToRedirectTo = '/trial-sessions';
  if (props.trialSessionId) {
    urlToRedirectTo = `/trial-session-detail/${props.trialSessionId}`;
  }
  store.set(state.printPaperDoneUrl, urlToRedirectTo);
};
