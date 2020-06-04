import { state } from 'cerebral';

export const externalUserCasesHelper = get => {
  const openCases = get(state.formattedOpenCases);
  const closedCases = get(state.formattedClosedCases);
  const openCurrentPage = get(state.openCasesCurrentPage) || 1;
  const closedCurrentPage = get(state.closedCasesCurrentPage) || 1;
  const pageSize = get(state.constants.CASE_SEARCH_PAGE_SIZE);

  return {
    closedCaseResults: closedCases.slice(0, closedCurrentPage * pageSize),
    openCaseResults: openCases.slice(0, openCurrentPage * pageSize),
    showLoadMoreClosedCases: closedCases.length > closedCurrentPage * pageSize,
    showLoadMoreOpenCases: openCases.length > openCurrentPage * pageSize,
  };
};
