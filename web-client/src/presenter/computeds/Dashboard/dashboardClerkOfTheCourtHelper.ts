import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { ClerkOfCourtDashboardState } from '@web-client/presenter/clerkOfCourtDashboardState';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const COLOR_BLUE = '#005EA2';
const COLOR_YELLOW = '#FFBE2E';

const SESSION_TYPE_COLORS: Record<string, string> = {
  Regular: '#B4D0B9',
  Hybrid: '#FEE685',
  Small: '#97D4EA',
  'Hybrid-S': '#F2938C',
  'Motion/Hearing': '#D0C3E9',
  Special: '#E5A000',
};

export const dashboardClerkOfTheCourtHelper = (
  get: Get,
  _applicationContext: ClientApplicationContext,
): ClerkOfCourtDashboardState => {
  const stats = get(state.clerkOfCourtDashboardStats);

  const specialSessionsByLocation = stats.specialSessionsByLocation.map(
    ({ trialLocation, count }) => ({
      color: COLOR_BLUE,
      label: trialLocation,
      value: count,
    }),
  );
  const petitionsByMonthDatasets = [
    {
      color: COLOR_BLUE,
      data: stats.petitionsByMonth.map(m => m.electronic),
      label: 'Electronic',
    },
    {
      color: COLOR_YELLOW,
      data: stats.petitionsByMonth.map(m => m.paper),
      label: 'Paper',
    },
  ];
  const closedCasesDatasets = [
    {
      color: COLOR_BLUE,
      data: stats.closedCasesByMonth.map(m => m.closed),
      label: 'Closed',
    },
    {
      color: COLOR_YELLOW,
      data: stats.closedCasesByMonth.map(m => m.closedDismissed),
      label: 'Closed - Dismissed',
    },
  ];

  const casesFiledDatasets = [
    {
      data: stats.casesFiledByMonth.map(m =>
        m.regular > 0 ? m.regular : null,
      ),
      label: 'Regular Cases',
    },
    {
      data: stats.casesFiledByMonth.map(m => (m.small > 0 ? m.small : null)),
      label: 'Small Tax Cases',
    },
  ];

  const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
  const caseTypeMap = new Map<string, number[]>();
  for (const { caseType, quarter, count } of stats.caseTypeByQuarter) {
    if (!caseTypeMap.has(caseType)) {
      caseTypeMap.set(caseType, [0, 0, 0, 0]);
    }
    const quarterData = caseTypeMap.get(caseType);
    if (quarterData) {
      quarterData[quarter - 1] = count;
    }
  }

  const caseTypeBreakdownDatasets = Array.from(caseTypeMap.entries()).map(
    ([label, data]) => ({ data, label }),
  );

  const totalProceedingSessions = stats.proceedingTypeCounts.reduce(
    (sum, r) => sum + r.count,
    0,
  );
  const procedureTypePieData =
    totalProceedingSessions > 0
      ? stats.proceedingTypeCounts.map(({ proceedingType, count }) => ({
          color: proceedingType === 'In Person' ? COLOR_BLUE : COLOR_YELLOW,
          name: proceedingType,
          value: count,
        }))
      : [];

  const totalSessionTypeSessions = stats.sessionTypeCounts.reduce(
    (sum, r) => sum + r.count,
    0,
  );

  const sessionTypePieData =
    totalSessionTypeSessions > 0
      ? stats.sessionTypeCounts.map(({ sessionType, count }) => ({
          color: SESSION_TYPE_COLORS[sessionType] ?? '#CCCCCC',
          name: sessionType,
          value: count,
        }))
      : [];

  return {
    specialSessionsByLocation,
    petitionsByMonthLabels: MONTHS,
    petitionsByMonthDatasets,
    closedCasesLabels: MONTHS,
    closedCasesDatasets,
    casesFiledLabels: MONTHS,
    casesFiledDatasets,
    caseTypeBreakdownLabels: quarterLabels,
    caseTypeBreakdownDatasets,
    procedureTypePieData,
    sessionTypePieData,
    totalSessionsScheduled: totalSessionTypeSessions,
  };
};
