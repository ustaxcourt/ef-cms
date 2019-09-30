/**
 * displayDownloadLinkAction
 *
 * @param {object} provider the provider object
 * @param {object} provider.props the props object
 * @param {object} provider.router the router object
 */
export const displayDownloadLinkAction = ({ props, router }) => {
  router.openInNewTab(props.url, false);
};
