import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const externalUserCasesHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
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
  let openCasesCount = 0;

  formattedOpenCases.forEach(aCase => {
    if (aCase.consolidatedCases) {
      aCase.consolidatedCases.forEach(consolidatedCase => {
        if (consolidatedCase.isRequestingUserAssociated) {
          openCasesCount = openCasesCount + 1;
        }
      });
    }
    if (aCase.isRequestingUserAssociated) {
      openCasesCount = openCasesCount + 1;
    }
  });

  return {
    closedCaseResults: formattedClosedCases.slice(
      0,
      closedCurrentPage * pageSize,
    ),
    closedCasesCount: formattedClosedCases.length,
    openCaseResults: formattedOpenCases.slice(0, openCurrentPage * pageSize),
    openCasesCount,
    showLoadMoreClosedCases:
      formattedClosedCases.length > closedCurrentPage * pageSize,
    showLoadMoreOpenCases:
      formattedOpenCases.length > openCurrentPage * pageSize,
  };
};
