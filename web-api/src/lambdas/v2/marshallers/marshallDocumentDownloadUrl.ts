/**
 * The returned object is specified by the v2 API and any changes to these properties
 * beyond additions must be accompanied by a version increase.
 *
 * @param {object} urlObject the most up-to-date representation of a url
 * @returns {object} the v2 representation of a url
 */
export const marshallDocumentDownloadUrl = urlObject => {
  return {
    url: urlObject.url,
  };
};
