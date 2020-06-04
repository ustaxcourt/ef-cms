import { Document } from '../../../../../shared/src/business/entities/Document';
import { paginationHelper } from './advancedSearchHelper';
import { state } from 'cerebral';

export const advancedDocumentSearchHelper = (get, applicationContext) => {
  let paginatedResults = {};
  const searchResults = get(state.searchResults);
  const isPublic = get(state.isPublic);

  if (searchResults) {
    paginatedResults = paginationHelper(
      searchResults,
      get(state.advancedSearchForm.currentPage),
      applicationContext.getConstants().CASE_SEARCH_PAGE_SIZE,
    );

    paginatedResults.formattedSearchResults = paginatedResults.searchResults.map(
      searchResult =>
        formatDocumentSearchResultRecord(searchResult, { applicationContext }),
    );
  }

  return {
    ...paginatedResults,
    isPublic,
  };
};

export const formatDocumentSearchResultRecord = (
  result,
  { applicationContext },
) => {
  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.filingDate, 'MMDDYY');

  result.caseTitle = applicationContext.getCaseTitle(result.caseCaption || '');

  const eventCodeAndDocumentType = result.documentType.split('-');
  result.formattedEventCode = eventCodeAndDocumentType[0].trim();
  result.formattedDocumentType = eventCodeAndDocumentType[1].trim();

  if (Document.OPINION_DOCUMENT_TYPES.includes(result.formattedEventCode)) {
    result.formattedJudgeName = result.judge
      ? applicationContext.getUtilities().getJudgeLastName(result.judge)
      : '';
  } else if (
    Document.ORDER_DOCUMENT_TYPES.includes(result.formattedEventCode)
  ) {
    result.formattedSignedJudgeName = result.signedJudgeName
      ? applicationContext
          .getUtilities()
          .getJudgeLastName(result.signedJudgeName)
      : '';
  }

  return result;
};
