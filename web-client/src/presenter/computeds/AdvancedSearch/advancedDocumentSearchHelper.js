import { Document } from '../../../../../shared/src/business/entities/Document';
import { capitalize } from 'lodash';
import { paginationHelper } from './advancedSearchHelper';
import { state } from 'cerebral';

export const advancedDocumentSearchHelper = (get, applicationContext) => {
  let paginatedResults = {};
  const searchResults = get(state.searchResults);
  const isPublic = get(state.isPublic);
  const advancedSearchTab = get(state.advancedSearchTab);
  const searchTabs = get(state.constants.ADVANCED_SEARCH_TABS);
  let documentTypeVerbiage = capitalize(advancedSearchTab);

  if (advancedSearchTab === searchTabs.OPINION) {
    documentTypeVerbiage = `${documentTypeVerbiage} type`;
  }

  if (searchResults) {
    paginatedResults = paginationHelper(
      searchResults,
      get(state.advancedSearchForm.currentPage),
      applicationContext.getConstants().CASE_SEARCH_PAGE_SIZE,
    );

    paginatedResults.formattedSearchResults = paginatedResults.searchResults.map(
      searchResult =>
        formatDocumentSearchResultRecord(get, searchResult, advancedSearchTab, {
          applicationContext,
        }),
    );
  }

  return {
    ...paginatedResults,
    documentTypeVerbiage,
    isPublic,
  };
};

export const formatDocumentSearchResultRecord = (
  get,
  result,
  advancedSearchTab,
  { applicationContext },
) => {
  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.filingDate, 'MMDDYY');

  result.caseTitle = applicationContext.getCaseTitle(result.caseCaption || '');
  result.formattedDocumentType = Document.getFormattedType(result.documentType);

  const searchTabs = get(state.constants.ADVANCED_SEARCH_TABS);
  if (advancedSearchTab === searchTabs.OPINION) {
    result.documentTitle = result.formattedDocumentType;
  }

  if (Document.OPINION_DOCUMENT_TYPES.includes(result.eventCode)) {
    result.formattedJudgeName = result.judge
      ? applicationContext.getUtilities().getJudgeLastName(result.judge)
      : '';
  } else if (Document.ORDER_DOCUMENT_TYPES.includes(result.eventCode)) {
    result.formattedSignedJudgeName = result.signedJudgeName
      ? applicationContext
          .getUtilities()
          .getJudgeLastName(result.signedJudgeName)
      : '';
  }

  return result;
};
