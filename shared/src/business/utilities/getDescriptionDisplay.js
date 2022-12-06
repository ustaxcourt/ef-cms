/**
 * returns a modified document title when adding new information to a previous document title
 * especially in the case of qc'ing a docket entry
 *
 * @param {string} documentMetaData name of the feature
 * @returns {string} document title after modification
 */

const getDescriptionDisplay = docketEntry => {
  let descriptionDisplay =
    docketEntry.documentTitle ||
    docketEntry.description ||
    docketEntry.documentType;

  if (docketEntry.additionalInfo) {
    if (docketEntry.addToCoversheet) {
      descriptionDisplay += ` ${docketEntry.additionalInfo}`;
    }
  }

  if (docketEntry.eventCode === 'OCS' && docketEntry.freeText) {
    descriptionDisplay = `${docketEntry.freeText} - ${descriptionDisplay}`;
  }

  // POTENTIAL USE CASE: ACCOUNT FOR FILINGS AND PROCEEDINGS as part of title

  return descriptionDisplay;
};

module.exports = {
  getDescriptionDisplay,
};
