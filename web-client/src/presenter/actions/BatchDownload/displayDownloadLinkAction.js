import { state } from 'cerebral';

/**
 * displayDownloadLinkAction
 *
 * @param {object} provider the provider object
 * @param {object} provider.props the props object
 * @param {object} provider.router the router object
 */
export const displayDownloadLinkAction = ({ props, router, store }) => {
  store.set(state.batchTrialSessionAllCasesDownloadUrl, props.url);
  router.openInNewTab(props.url, false);
};
