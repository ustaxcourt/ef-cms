const {
  formatDocketEntry,
  getFilingsAndProceedings,
} = require('./getFormattedCaseDetail');

/**
 * Gets document title based on documentTitle and additionalInfo fields
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} docketEntry the docketEntry
 * @returns {object} the document title
 */

const getDocumentTitle = ({ applicationContext, docketEntry }) => {
  let { documentTitle } = docketEntry;
  if (docketEntry.addToCoversheet) {
    if (docketEntry.additionalInfo) {
      documentTitle += ` ${docketEntry.additionalInfo}`;
    }
    documentTitle += ` ${getFilingsAndProceedings(
      formatDocketEntry(applicationContext, docketEntry),
    )}`;
    if (docketEntry.additionalInfo2) {
      documentTitle += ` ${docketEntry.additionalInfo2}`;
    }
  }
  return documentTitle;
};

module.exports = { getDocumentTitle };
