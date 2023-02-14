import { state } from 'cerebral';

export const externalUserCasesHelper = (get, applicationContext) => {
  const { formatCase } = applicationContext.getUtilities();

  const openCases = get(state.openCases);
  const closedCases = get(state.closedCases);

  const formattedOpenCases = openCases.map(openCase =>
    formatCase(applicationContext, openCase),
  );
  const formattedClosedCases = closedCases.map(closedCase =>
    formatCase(applicationContext, closedCase),
  );

  const openCurrentPage = get(state.openCasesCurrentPage) || 1;
  const closedCurrentPage = get(state.closedCasesCurrentPage) || 1;
  const pageSize = get(state.constants.CASE_LIST_PAGE_SIZE);

  return {
    closedCaseResults: formattedClosedCases.slice(
      0,
      closedCurrentPage * pageSize,
    ),
    closedCasesCount: formattedClosedCases.length,
    openCaseResults: formattedOpenCases.slice(0, openCurrentPage * pageSize),
    openCasesCount: formattedOpenCases.length,
    showLoadMoreClosedCases:
      formattedClosedCases.length > closedCurrentPage * pageSize,
    showLoadMoreOpenCases:
      formattedOpenCases.length > openCurrentPage * pageSize,
  };
};
