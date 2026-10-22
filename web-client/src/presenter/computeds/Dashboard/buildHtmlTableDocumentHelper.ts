import { ClerkDashboardCaseTypeTotal } from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';
import { ClerkOfCourtTableRow } from '@web-client/presenter/clerkOfCourtDashboardState';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import {
  CASE_TYPES,
  CASE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';
import { escape } from 'lodash';
import { formatPositiveNumber } from '@web-client/business/utilities/formatPositiveNumber';
import { state } from '@web-client/presenter/app.cerebral';

export const ALL_OPEN_CASES_BY_TYPE_HTML_TITLE = 'All Open Cases by Type';

type HtmlTableOptions = {
  labelHeader: string;
  rows: ClerkOfCourtTableRow[];
  title: string;
  totalHeader: string;
};

/** Builds the standalone HTML document that the HTML view opens, escaping all text */
export const buildHtmlTableDocument = ({
  labelHeader,
  rows,
  title,
  totalHeader,
}: HtmlTableOptions): string => {
  const tableRows = rows
    .map(
      ({ label, total }) =>
        `<tr><td>${escape(label)}</td><td>${escape(total)}</td></tr>`,
    )
    .join('');
  const tableTitle = escape(title);
  return `<html lang="en"><head><title>${tableTitle}</title></head><body><h2>${tableTitle}</h2><table border="1" cellpadding="4" cellspacing="0"><thead><tr><th>${escape(labelHeader)}</th><th>${escape(totalHeader)}</th></tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
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
): { openCasesByTypeHtmlDocument: string } => {
  // all open cases, so the YTD/FYTD option does not apply
  const openCasesByCaseType = get(
    state.clerkOfCourtDashboardStats.openCasesByCaseType,
  );

  return {
    openCasesByTypeHtmlDocument: buildHtmlTableDocument({
      labelHeader: 'Type of Case',
      rows: getOpenCasesByTypeTableRows(openCasesByCaseType),
      title: ALL_OPEN_CASES_BY_TYPE_HTML_TITLE,
      totalHeader: 'Total',
    }),
  };
};
