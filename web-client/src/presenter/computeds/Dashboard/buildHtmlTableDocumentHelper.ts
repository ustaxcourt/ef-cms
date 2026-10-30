import { ClerkDashboardCaseTypeTotal } from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';
import { ClerkOfCourtTableRow } from '@web-client/presenter/clerkOfCourtDashboardState';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import {
  CASE_TYPES,
  CASE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';
import { formatPositiveNumber } from '@web-client/business/utilities/formatPositiveNumber';
import { state } from '@web-client/presenter/app.cerebral';

/** The content of an HTML view table; ClerkOfCourtHtmlView renders the markup */
export type ClerkOfCourtHtmlTable = {
  labelHeader: string;
  rows: ClerkOfCourtTableRow[];
  title: string;
  totalHeader: string;
};

// the order of case types with the same total: Deficiency first, then the other case types
const OPEN_CASES_BY_TYPE_ORDER: string[] = [
  CASE_TYPES_MAP.deficiency,
  ...CASE_TYPES.filter(caseType => caseType !== CASE_TYPES_MAP.deficiency),
];

// largest total first; sort is stable, so equal totals keep OPEN_CASES_BY_TYPE_ORDER
const getOpenCasesByTypeTableRows = (
  openCasesByCaseType: ClerkDashboardCaseTypeTotal[],
): ClerkOfCourtTableRow[] =>
  OPEN_CASES_BY_TYPE_ORDER.map(caseType => ({
    caseType,
    total: openCasesByCaseType.find(c => c.caseType === caseType)?.total ?? 0,
  }))
    .sort((a, b) => b.total - a.total)
    .map(({ caseType, total }) => ({
      label: caseType,
      total: formatPositiveNumber(total),
    }));

export const buildHtmlTableDocumentHelper = (
  get: Get,
  _applicationContext: ClientApplicationContext,
): { openCasesByTypeTable: ClerkOfCourtHtmlTable } => {
  // all open cases, so the YTD/FYTD option does not apply
  const openCasesByCaseType = get(
    state.clerkOfCourtDashboardStats.openCasesByCaseType,
  );

  return {
    openCasesByTypeTable: {
      labelHeader: 'Type of Case',
      rows: getOpenCasesByTypeTableRows(openCasesByCaseType),
      title: 'All Open Cases by Type',
      totalHeader: 'Total',
    },
  };
};
