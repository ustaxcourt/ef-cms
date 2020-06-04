import { state } from 'cerebral';

export const externalUserClosedCasesHelper = get => {
  const closedCases = get(state.formattedClosedCases);
  const currentPage = get(state.closedCasesCurrentPage) || 1;
  const pageSize = get(state.constants.CASE_SEARCH_PAGE_SIZE);

  return {
    caseResults: closedCases.slice(0, currentPage * pageSize),
    showLoadMore: closedCases.length > currentPage * pageSize,
  };
};
