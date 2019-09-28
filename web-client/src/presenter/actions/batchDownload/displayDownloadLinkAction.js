export const displayDownloadLinkAction = async ({ props, router }) => {
  router.openInNewTab(props.url, false);
};
