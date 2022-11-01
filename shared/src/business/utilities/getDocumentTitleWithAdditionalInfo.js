/**
 * Gets document title with additionalInfo if addToCoversheet is true
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} docketEntry the docketEntry
 * @returns {object} the document title
 */
const getDocumentTitleWithAdditionalInfo = ({ docketEntry }) => {
  let { documentTitle } = docketEntry;

  /** 
   * 
   * POSSIBLE SOLUTION: FIND A GOOD USE CASE (MAYBE CHECK FOR DOC TYPE), for rendering 
   doc title based on the existence of the additional info in the docTitle already
   code snippet below:

  const documentTitleWithAdditionalInfo = documentTitle.includes(
   docketEntry.additionalInfo,
   )
     ? documentTitle
     : `${documentTitle} ${docketEntry.additionalInfo}`;

   documentTitle = `${documentTitleWithAdditionalInfo}
    }`.trim();
   *
   */

  if (docketEntry.addToCoversheet) {
    documentTitle = `${documentTitle} ${
      docketEntry.additionalInfo || ''
    }`.trim();
  }
  return documentTitle;
};

module.exports = { getDocumentTitleWithAdditionalInfo };
