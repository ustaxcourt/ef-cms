/**
 * Formats the documentTitle for standalone remote trial sessions
 *
 * @param {string} documentTitle the document title
 * @returns {string} formatted documentTitle
 */
exports.getStandaloneRemoteDocumentTitle = ({ documentTitle }) => {
  return documentTitle.replace('at [Place]', 'in standalone remote session');
};
