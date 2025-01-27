import {
  CaseAdvancedSearchResultItem,
  CaseAdvancedSearchTerms,
  caseAdvancedSearch,
} from '@web-api/persistence/elasticsearch/caseAdvancedSearch';

export const casePublicSearch = async ({
  searchTerms,
}: {
  searchTerms: CaseAdvancedSearchTerms;
}): Promise<CaseAdvancedSearchResultItem[]> => {
  // The same results as caseAdvancedSearch, but with sealed cases filtered out
  return await caseAdvancedSearch({
    searchTerms: { ...searchTerms, hideSealedCases: true },
  });
};
