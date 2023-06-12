/**
 * returns a modified document title when adding new information to a previous document title
 * especially in the case of qc'ing a docket entry
 *
 * @param {Object} docketEntry name of the feature
 * @returns {string} document title after modification
 */

export const getDescriptionDisplay = docketEntry => {
  let descriptionDisplay =
    docketEntry.documentTitle ||
    docketEntry.description ||
    docketEntry.documentType;

  if (docketEntry.additionalInfo) {
    descriptionDisplay += ` ${docketEntry.additionalInfo}`;
  }

  if (docketEntry.filingsAndProceedings) {
    descriptionDisplay += ` ${docketEntry.filingsAndProceedings}`;
  }

  if (docketEntry.additionalInfo2) {
    descriptionDisplay += ` ${docketEntry.additionalInfo2}`;
  }

  if (docketEntry.eventCode === 'OCS' && docketEntry.freeText) {
    descriptionDisplay = `${docketEntry.freeText} - ${descriptionDisplay}`;
  }

  return descriptionDisplay;
};
