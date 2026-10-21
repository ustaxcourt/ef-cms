import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import {
  ClerkDashboardCaseTypeTotal,
  ClerkDashboardProcedureTypeTotal,
} from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';
import {
  ClerkOfCourtPieChartData,
  ClerkOfCourtTableRow,
  DashboardClerkOfTheCourtHelper,
} from '@web-client/presenter/clerkOfCourtDashboardState';
import { sum } from 'lodash';
import { formatPositiveNumber } from '@web-client/business/utilities/formatPositiveNumber';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import {
  CASE_TYPES,
  CASE_TYPES_MAP,
  FISCAL_MONTH_LABELS,
  GRAPH_COLORS,
  MONTH_LABELS,
  PROCEDURE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';

const PROCEDURE_TYPE_COLORS = {
  [PROCEDURE_TYPES_MAP.regular]: GRAPH_COLORS.BLUE,
  [PROCEDURE_TYPES_MAP.small]: GRAPH_COLORS.YELLOW,
};

const getProcedureTypePieData = (
  procedureTypeTotals: ClerkDashboardProcedureTypeTotal[],
): ClerkOfCourtPieChartData[] =>
  sum(procedureTypeTotals.map(p => p.total)) > 0
    ? procedureTypeTotals.map(({ procedureType, total }) => ({
        color: PROCEDURE_TYPE_COLORS[procedureType],
        name: procedureType,
        value: total,
      }))
    : [];

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

export const dashboardClerkOfTheCourtHelper = (
  get: Get,
  _applicationContext: ClientApplicationContext,
): DashboardClerkOfTheCourtHelper => {
  const stats = get(state.clerkOfCourtDashboardStats);

  // the stats carry the court's current years; until they load, fall back to the browser's
  const year = stats.year || formatNow(FORMATS.YEAR);
  const fiscalYear = stats.fiscalYear || year;
  const getYearLabel = (isFiscal: boolean): string =>
    isFiscal ? `FYTD ${fiscalYear}` : `YTD ${year}`;

  const petitionsByYearIsFiscal = get(
    state.clerkOfCourtDashboardOptions.petitionsByYearIsFiscal,
  );

  const petitionerStats = petitionsByYearIsFiscal
    ? stats.fiscalYearPetitionStats
    : stats.calendarYearPetitionStats;

  const petitionsByMonthAndServiceTypeChartData = [
    {
      color: GRAPH_COLORS.BLUE,
      data: petitionerStats.petitionFullElectronicMonths.map(p => p.total),
      label: 'Electronic',
    },
    {
      color: GRAPH_COLORS.YELLOW,
      data: petitionerStats.petitionFullPaperMonths.map(p => p.total),
      label: 'Paper',
    },
  ];

  const petitionsByServiceTypePieData =
    petitionerStats.petitionsByServiceType.length > 0
      ? petitionerStats.petitionsByServiceType.map(({ isPaper, total }) => ({
          color: isPaper ? GRAPH_COLORS.YELLOW : GRAPH_COLORS.BLUE,
          name: isPaper ? 'Paper' : 'Electronic',
          value: total,
        }))
      : [];

  const petitionsByRepresentationPieData =
    petitionerStats.petitionsByRepresentation.length > 0
      ? petitionerStats.petitionsByRepresentation.map(
          ({ isRepresenting, total }) => ({
            color: isRepresenting ? GRAPH_COLORS.YELLOW : GRAPH_COLORS.BLUE,
            name: isRepresenting ? 'Represented' : 'Pro Se',
            value: total,
          }),
        )
      : [];

  const totalPetitions = sum(
    petitionerStats.petitionsByServiceType.map(p => p.total),
  );

  const casesByYearIsFiscal = get(
    state.clerkOfCourtDashboardOptions.casesByYearIsFiscal,
  );

  const caseStats = casesByYearIsFiscal
    ? stats.fiscalYearCaseStats
    : stats.calendarYearCaseStats;

  const totalCasesClosed = sum(
    caseStats.casesClosedByProcedureType.map(p => p.total),
  );

  const totalCasesOnAppeal = sum(
    caseStats.casesOnAppealByMonth.map(p => p.total),
  );

  const casesClosedAndOnAppealByMonthChartData = [
    {
      color: GRAPH_COLORS.BLUE,
      data: caseStats.casesClosedByMonth.map(p => p.total),
      label: 'Closed/Closed-Dismissed',
    },
    {
      color: GRAPH_COLORS.YELLOW,
      data: caseStats.casesOnAppealByMonth.map(p => p.total),
      label: 'Changed to On Appeal',
    },
  ];

  return {
    casesClosedAndOnAppealByMonthChartData,
    casesClosedAndOnAppealLegendTotals: [totalCasesClosed, totalCasesOnAppeal],
    casesClosedPieData: getProcedureTypePieData(
      caseStats.casesClosedByProcedureType,
    ),
    casesMonths: casesByYearIsFiscal ? FISCAL_MONTH_LABELS : MONTH_LABELS,
    openCasesByTypeTableRows: getOpenCasesByTypeTableRows(
      caseStats.openCasesByCaseType,
    ),
    openCasesPieData: getProcedureTypePieData(
      caseStats.openCasesByProcedureType,
    ),
    totalCasesClosed: formatPositiveNumber(totalCasesClosed),
    totalOpenCases: formatPositiveNumber(
      sum(caseStats.openCasesByProcedureType.map(p => p.total)),
    ),
    petitionsByMonthAndServiceTypeChartData,
    petitionsByRepresentationPieData,
    petitionsByServiceTypePieData,
    totalPetitions: formatPositiveNumber(totalPetitions),
    months: petitionsByYearIsFiscal ? FISCAL_MONTH_LABELS : MONTH_LABELS,
    casesYearLabel: getYearLabel(casesByYearIsFiscal),
    petitionsYearLabel: getYearLabel(petitionsByYearIsFiscal),
  };
};
