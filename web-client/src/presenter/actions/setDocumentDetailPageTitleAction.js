import { setPageTitle } from '../../utilities/setPageTitle';
import { state } from 'cerebral';

export const setDocumentDetailPageTitleAction = async ({ get }) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  const documentId = get(state.documentId);
  const documents = get(state.caseDetail.documents);
  const document = (documents || []).find(
    item => item.documentId === documentId,
  );

  const pageTitle = `Docket ${docketNumber} | ${document.documentType}`;
  setPageTitle(pageTitle);
};
