const { Case } = require('../entities/cases/Case');

/**
 * Gets case caption parts from case data
 *
 * @param {object} caseDetail case detail object
 * @returns {object} case caption parts
 */

const getCaseCaptionMeta = caseDetail => {
  const { CASE_CAPTION_POSTFIX } = Case;
  const { caseCaption } = caseDetail;

  const caseTitle = Case.getCaseTitle(caseDetail.caseCaption);
  const caseCaptionExtension = caseDetail.caseCaption
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
