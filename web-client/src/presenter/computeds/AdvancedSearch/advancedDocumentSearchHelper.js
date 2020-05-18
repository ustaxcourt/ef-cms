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

  result.docketNumberWithSuffix = `${result.docketNumber}${
    result.docketNumberSuffix ? result.docketNumberSuffix : ''
  }`;

  if (Document.OPINION_DOCUMENT_TYPES.includes(result.documentType)) {
    result.formattedJudgeName = applicationContext
      .getUtilities()
      .getJudgeLastName(result.judge);

    result.formattedDocumentType = result.documentType.split('-').pop().trim();
  } else if (Document.ORDER_DOCUMENT_TYPES.includes(result.documentType)) {
    result.formattedSignedJudgeName = result.signedJudgeName
      ? applicationContext
          .getUtilities()
          .getJudgeLastName(result.signedJudgeName)
      : '';
  }

  result.formattedJudgeName = result.judge
    ? applicationContext.getUtilities().getJudgeLastName(result.judge)
    : '';

  return result;
};
