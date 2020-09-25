const { Case } = require('../entities/cases/Case');
const { CASE_CAPTION_POSTFIX } = require('../entities/EntityConstants');

/**
 * Gets case caption parts from case data
 *
 * @param {object} caseDetail case detail object
 * @returns {object} case caption parts
 */

const getCaseCaptionMeta = ({ caseCaption }) => {
  const caseTitle = Case.getCaseTitle(caseCaption);
  const caseCaptionExtension = caseCaption
    .replace(caseTitle, '')
    .replace(', ', '');

  return {
    CASE_CAPTION_POSTFIX,
    caseCaption,
    caseCaptionExtension,
    caseCaptionWithPostfix: `${caseCaption} ${CASE_CAPTION_POSTFIX}`,
    caseTitle,
  };
};

module.exports = { getCaseCaptionMeta };
