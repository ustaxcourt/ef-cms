import { CASE_CAPTION_POSTFIX } from '../entities/EntityConstants';
import { Case } from '../entities/cases/Case';

/**
 * Gets case caption parts from case data
 *
 * @param {object} caseDetail case detail object
 * @returns {object} case caption parts
 */

export const getCaseCaptionMeta = ({ caseCaption = '' }) => {
  const caseTitle = Case.getCaseTitle(caseCaption);
  const caseCaptionExtension = caseCaption
    .replace(caseTitle, '')
    .replace(', ', '');

  const caseCaptionWithPostfix =
    caseCaption.length > 0 ? `${caseCaption} ${CASE_CAPTION_POSTFIX}` : '';

  return {
    CASE_CAPTION_POSTFIX,
    caseCaption,
    caseCaptionExtension,
    caseCaptionWithPostfix,
    caseTitle,
  };
};
