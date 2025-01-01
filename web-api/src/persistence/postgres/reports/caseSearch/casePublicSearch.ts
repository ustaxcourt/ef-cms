import {
  CaseAdvancedSearchResultItem,
  CaseAdvancedSearchTerms,
  caseAdvancedSearch,
} from '@web-api/persistence/postgres/reports/caseSearch/caseAdvancedSearch';

export const casePublicSearch = async ({
  searchTerms,
}: {
  applicationContext: IApplicationContext;
  searchTerms: CaseAdvancedSearchTerms;
}): Promise<CaseAdvancedSearchResultItem[]> => {
  // The same results as caseAdvancedSearch, but with sealed cases filtered out
  return await caseAdvancedSearch({
    searchTerms: { ...searchTerms, hideSealedCases: true },
  });
};
