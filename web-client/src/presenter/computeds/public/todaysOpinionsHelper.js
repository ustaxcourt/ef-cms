import { Document } from '../../../../../shared/src/business/entities/Document';
import { state } from 'cerebral';

export const todaysOpinionsHelper = (get, applicationContext) => {
  const todaysOpinions = get(state.todaysOpinions);
  const baseUrl = get(state.baseUrl);

  const currentDate = applicationContext.getUtilities().createISODateString();
  const formattedCurrentDate = applicationContext
    .getUtilities()
    .formatDateString(currentDate, 'MMMM D, YYYY');

  const formattedOpinions = todaysOpinions.map(opinion => ({
    ...opinion,
    documentLink: `${baseUrl}/public-api/${opinion.caseId}/${opinion.documentId}/public-document-download-url`,
    formattedDocumentType: Document.getFormattedType(opinion.documentType),
    formattedFilingDate: applicationContext
      .getUtilities()
      .formatDateString(opinion.filingDate, 'MMDDYY'),
    formattedJudgeName: applicationContext
      .getUtilities()
      .getJudgeLastName(opinion.judge),
  }));

  return { formattedCurrentDate, formattedOpinions };
};
