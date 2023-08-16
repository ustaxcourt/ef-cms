import { CASE_CAPTION_POSTFIX } from '../entities/EntityConstants';
import { Case } from '../entities/cases/Case';

export const getCaseCaptionMeta = ({
  caseCaption = '',
}: {
  caseCaption: string;
}) => {
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
