// The returned object is specified by the v1 API and should not change
// without changing the API version.
exports.marshallDocumentDownloadUrl = urlObject => {
  return {
    url: urlObject.url,
  };
};
