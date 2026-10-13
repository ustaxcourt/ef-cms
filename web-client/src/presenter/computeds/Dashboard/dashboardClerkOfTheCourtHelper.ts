import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import {
  ClerkDashboardCaseTypeTotal,
  ClerkDashboardProcedureTypeTotal,
} from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';
import {
  ClerkOfCourtBarChartDataset,
  ClerkOfCourtPieChartData,
  DashboardClerkOfTheCourtHelper,
} from '@web-client/presenter/clerkOfCourtDashboardState';
import { sum } from 'lodash';
import { formatPositiveNumber } from '@web-client/business/utilities/formatPositiveNumber';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import {
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

// Case types are grouped into one bar per category; categories with several case
// types are stacked by subtype, labelled with the subtype name in the tooltip.
const OPEN_CASES_BY_TYPE_CATEGORIES: {
  label: string;
  subtypes?: { caseType: string; label: string }[];
  caseType?: string;
}[] = [
  { caseType: CASE_TYPES_MAP.deficiency, label: 'Deficiency' },
  { caseType: CASE_TYPES_MAP.cdp, label: 'CDP (Lien/Levy)' },
  {
    label: 'Declaratory Judgment',
    subtypes: [
      { caseType: CASE_TYPES_MAP.djExemptOrg, label: 'Exempt Organization' },
      { caseType: CASE_TYPES_MAP.djRetirementPlan, label: 'Retirement Plan' },
    ],
  },
  { caseType: CASE_TYPES_MAP.disclosure, label: 'Disclosure' },
  { caseType: CASE_TYPES_MAP.innocentSpouse, label: 'Innocent Spouse' },
  { caseType: CASE_TYPES_MAP.interestAbatement, label: 'Interest Abatement' },
  { caseType: CASE_TYPES_MAP.other, label: 'Other' },
  {
    label: 'Partnership',
    subtypes: [
      {
        caseType: CASE_TYPES_MAP.partnershipSection1101,
        label: 'BBA Section 1101',
      },
      {
        caseType: CASE_TYPES_MAP.partnershipSection6226,
        label: 'Section 6226',
      },
      {
        caseType: CASE_TYPES_MAP.partnershipSection6228,
        label: 'Section 6228',
      },
    ],
  },
  { caseType: CASE_TYPES_MAP.passport, label: 'Passport' },
  { caseType: CASE_TYPES_MAP.whistleblower, label: 'Whistleblower' },
  {
    caseType: CASE_TYPES_MAP.workerClassification,
    label: 'Worker Classification',
  },
];

const getOpenCasesByTypeChartData = (
  openCasesByCaseType: ClerkDashboardCaseTypeTotal[],
): ClerkOfCourtBarChartDataset[] => {
  const totalFor = (caseType: string): number =>
    openCasesByCaseType.find(c => c.caseType === caseType)?.total ?? 0;

  const singleTypeDataset: ClerkOfCourtBarChartDataset = {
    color: GRAPH_COLORS.BLUE,
    data: OPEN_CASES_BY_TYPE_CATEGORIES.map(category =>
      category.caseType ? totalFor(category.caseType) : 0,
    ),
    label: 'Cases',
  };

  const subtypeDatasets = OPEN_CASES_BY_TYPE_CATEGORIES.flatMap(
    (category, categoryIndex) =>
      (category.subtypes ?? []).map(subtype => ({
        color: GRAPH_COLORS.BLUE,
        data: OPEN_CASES_BY_TYPE_CATEGORIES.map((_, i) =>
          i === categoryIndex ? totalFor(subtype.caseType) : 0,
        ),
        label: subtype.label,
      })),
  );

  return [singleTypeDataset, ...subtypeDatasets];
};

export const dashboardClerkOfTheCourtHelper = (
  get: Get,
  _applicationContext: ClientApplicationContext,
): DashboardClerkOfTheCourtHelper => {
  const stats = get(state.clerkOfCourtDashboardStats);

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
    openCasesByTypeChartData: getOpenCasesByTypeChartData(
      stats.openCasesByCaseType,
    ),
    openCasesByTypeLabels: OPEN_CASES_BY_TYPE_CATEGORIES.map(c => c.label),
    openCasesPieData: getProcedureTypePieData(stats.openCasesByProcedureType),
    totalCasesClosed: formatPositiveNumber(totalCasesClosed),
    totalOpenCases: formatPositiveNumber(
      sum(stats.openCasesByProcedureType.map(p => p.total)),
    ),
    petitionsByMonthAndServiceTypeChartData,
    petitionsByRepresentationPieData,
    petitionsByServiceTypePieData,
    totalPetitions: formatPositiveNumber(totalPetitions),
    months: petitionsByYearIsFiscal ? FISCAL_MONTH_LABELS : MONTH_LABELS,
    // the stats carry the court's current year; until they load, fall back to the browser's
    year: stats.year || formatNow(FORMATS.YEAR),
  };
};
