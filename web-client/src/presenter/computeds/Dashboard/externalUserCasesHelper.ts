import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { TAssociatedCase } from '@shared/business/useCases/getCasesForUserInteractor';
import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export type TAssociatedCaseFormatted = Omit<
  TAssociatedCase,
  'consolidatedCases'
> & {
  caseTitle: string;
  consolidatedIconTooltipText: string;
  createdAtFormatted: string;
  inConsolidatedGroup: boolean;
  consolidatedCases: TAssociatedCaseFormatted[] | undefined;
  isLeadCase: boolean;
};

export const externalUserCasesHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  closedCaseResults: TAssociatedCaseFormatted[];
  openCaseResults: TAssociatedCaseFormatted[];
  showLoadMoreClosedCases: boolean;
  showLoadMoreOpenCases: boolean;
  closedCasesCount: number;
  openCasesCount: number;
} => {
  const pageSize = applicationContext.getConstants().CASE_LIST_PAGE_SIZE;

  const openCases = get(state.openCases);
  const closedCases = get(state.closedCases);
  const openCurrentPage = get(state.openCasesCurrentPage) || 1;
  const closedCurrentPage = get(state.closedCasesCurrentPage) || 1;

  const formattedOpenCases = openCases.map(openCase =>
    formatAssociatedCase(applicationContext, openCase),
  );
  const formattedClosedCases = closedCases.map(closedCase =>
    formatAssociatedCase(applicationContext, closedCase),
  );

  return {
    closedCaseResults: formattedClosedCases.slice(
      0,
      closedCurrentPage * pageSize,
    ),
    closedCasesCount: getCountOfCases(formattedClosedCases),
    openCaseResults: formattedOpenCases.slice(0, openCurrentPage * pageSize),
    openCasesCount: getCountOfCases(formattedOpenCases),
    showLoadMoreClosedCases:
      formattedClosedCases.length > closedCurrentPage * pageSize,
    showLoadMoreOpenCases:
      formattedOpenCases.length > openCurrentPage * pageSize,
  };
};

const formatAssociatedCase = (
  applicationContext: ClientApplicationContext,
  caseA: TAssociatedCase,
): TAssociatedCaseFormatted => {
  const caseInQuestion = cloneDeep(caseA);

  const { consolidatedIconTooltipText, inConsolidatedGroup, isLeadCase } =
    applicationContext.getUtilities().setConsolidationFlagsForDisplay(caseA);

  return {
    ...caseInQuestion,
    caseTitle: applicationContext.getCaseTitle(
      caseInQuestion.caseCaption || '',
    ),
    consolidatedCases: caseInQuestion.consolidatedCases?.map(c => {
      return formatAssociatedCase(applicationContext, c);
    }),
    consolidatedIconTooltipText,
    createdAtFormatted: applicationContext
      .getUtilities()
      .formatDateString(caseInQuestion.createdAt, 'MMDDYY'),
    inConsolidatedGroup,
    isLeadCase,
  };
};

const getCountOfCases = (cases: TAssociatedCaseFormatted[]): number => {
  let count = 0;
  cases.forEach(aCase => {
    if (aCase.consolidatedCases) {
      aCase.consolidatedCases.forEach(consolidatedCase => {
        if (consolidatedCase.isRequestingUserAssociated) {
          count = count + 1;
        }
      });
    }
    if (aCase.isRequestingUserAssociated) {
      count = count + 1;
    }
  });

  return count;
};
