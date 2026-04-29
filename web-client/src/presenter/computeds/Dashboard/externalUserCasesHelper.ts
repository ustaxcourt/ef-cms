import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { TAssociatedCase } from '@shared/business/useCases/getCasesForUserInteractor';
import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { Case } from '@shared/business/entities/cases/Case';
import { dateStringsCompared } from 'shared/src/business/utilities/DateHandler';

export type TAssociatedCaseFormatted = Omit<
  TAssociatedCase,
  'consolidatedCases'
> & {
  caseTitle: string;
  consolidatedIconTooltipText: string;
  createdAtFormatted: string;
  inConsolidatedGroup: boolean;
  consolidatedCases: TAssociatedCaseFormatted[] | undefined;
  formattedStatus: string;
  isLeadCase: boolean;
};

const sortExternalUserCases = (
  cases: TAssociatedCaseFormatted[],
  sortField: string,
  sortOrder: string,
): TAssociatedCaseFormatted[] => {
  return cases.sort((caseA, caseB) => {
    let comparison = 0;
    const direction = sortOrder === 'desc' ? -1 : 1;

    switch (sortField) {
      case 'docketNumber': {
        comparison = Case.docketNumberSort(
          caseA.docketNumber,
          caseB.docketNumber,
        );
        break;
      }
      case 'caseTitle':
        comparison = caseA.caseTitle
          .toLowerCase()
          .localeCompare(caseB.caseTitle.toLowerCase());
        break;
      case 'filedDate':
        comparison = dateStringsCompared(
          caseA.createdAt || '',
          caseB.createdAt || '',
        );
        break;
      case 'status':
        comparison = caseA.formattedStatus.localeCompare(caseB.formattedStatus);
        break;
      case 'filingFee':
        comparison = caseA.petitionPaymentStatus.localeCompare(
          caseB.petitionPaymentStatus,
        );
        break;
      default:
        break;
    }

    return comparison * direction;
  });
};

export const externalUserCasesHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  closedCaseResults: TAssociatedCaseFormatted[];
  openCaseResults: TAssociatedCaseFormatted[];
  closedCasesCount: number;
  openCasesCount: number;
} => {
  const openCases = get(state.openCases);
  const closedCases = get(state.closedCases);
  const tableSort = get(state.caseListTableSort) || {
    sortField: 'filedDate',
    sortOrder: 'desc',
  };

  const formattedOpenCases = openCases.map(openCase =>
    formatAssociatedCase(applicationContext, openCase),
  );
  const formattedClosedCases = closedCases.map(closedCase =>
    formatAssociatedCase(applicationContext, closedCase),
  );

  // sort open/closed cases based off sorting headers
  const sortedOpenCases = sortExternalUserCases(
    formattedOpenCases,
    tableSort.sortField,
    tableSort.sortOrder,
  );
  const sortedClosedCases = sortExternalUserCases(
    formattedClosedCases,
    tableSort.sortField,
    tableSort.sortOrder,
  );

  return {
    closedCaseResults: sortedClosedCases,
    closedCasesCount: getCountOfCases(sortedClosedCases),
    openCaseResults: sortedOpenCases,
    openCasesCount: getCountOfCases(sortedOpenCases),
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
    formattedStatus: Case.formatCaseStatus({
      caseStatus: caseA.status,
      trialDate: caseA.trialDate,
      trialLocation: caseA.trialLocation,
    }),
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
