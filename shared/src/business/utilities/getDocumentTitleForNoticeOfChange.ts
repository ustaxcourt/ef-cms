import {
  formatDocketEntry,
  getFilingsAndProceedings,
} from './getFormattedCaseDetail';

/**
 * Gets document title based on documentTitle and additionalInfo fields
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} docketEntry the docketEntry
 * @returns {object} the document title
 */

export const getDocumentTitleForNoticeOfChange = ({
  docketEntry,
}) => {
  let { documentTitle } = docketEntry;
  const filingsAndProceedings = getFilingsAndProceedings(
    formatDocketEntry(docketEntry),
  );

  documentTitle = `${documentTitle} ${
    docketEntry.additionalInfo || ''
  } ${filingsAndProceedings} ${docketEntry.additionalInfo2 || ''}`
    .trim()
    .replace('   ', ' ')
    .replace('  ', ' ');

  return documentTitle;
};
