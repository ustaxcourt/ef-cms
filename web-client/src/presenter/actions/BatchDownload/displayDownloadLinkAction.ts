import { state } from '@web-client/presenter/app.cerebral';

/**
 * displayDownloadLinkAction
 *
 * @param {object} provider the provider object
 * @param {object} provider.props the props object
 * @param {object} provider.router the router object
 */
export const displayDownloadLinkAction = ({
  props,
  router,
  store,
}: ActionProps) => {
  store.set(state.batchTrialSessionAllCasesDownloadUrl, props.url);
  router.openInNewTab(props.url, false);
};
