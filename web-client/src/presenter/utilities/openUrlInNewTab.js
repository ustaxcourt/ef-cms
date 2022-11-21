export const openUrlInNewTab = async getUrlCb => {
  let url;

  const openFileViewerWindow = window.open();

  try {
    ({ url } = await getUrlCb());
  } catch (err) {
    throw new Error(`Unable to get document download url. ${err.message}`);
  }

  openFileViewerWindow.document.write('Loading your document...');
  openFileViewerWindow.location.href = url;
};
