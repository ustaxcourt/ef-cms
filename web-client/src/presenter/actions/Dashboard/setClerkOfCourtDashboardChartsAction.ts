import { state } from '@web-client/presenter/app.cerebral';

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

export const setClerkOfCourtDashboardChartsAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
  if (process.env.STAGE === 'prod' || process.env.STAGE === 'test') {
    return;
  }

  let stats;
  try {
    stats = await applicationContext
      .getUseCases()
      .getClerkDashboardStatsInteractor(applicationContext, {});
  } catch (e) {
    console.error('setClerkOfCourtDashboardChartsAction failed:', e);
    return;
  }

  store.set(
    state.clerkOfCourtDashboard.specialSessionsByLocation,
    stats.specialSessionsByLocation.map(({ trialLocation, count }) => ({
      color: COLOR_BLUE,
      label: trialLocation,
      value: count,
    })),
  );

  store.set(state.clerkOfCourtDashboard.petitionsByMonthLabels, MONTHS);
  store.set(state.clerkOfCourtDashboard.petitionsByMonthDatasets, [
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
  ]);

  store.set(state.clerkOfCourtDashboard.closedCasesLabels, MONTHS);
  store.set(state.clerkOfCourtDashboard.closedCasesDatasets, [
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
  ]);

  store.set(state.clerkOfCourtDashboard.casesFiledLabels, MONTHS);
  store.set(state.clerkOfCourtDashboard.casesFiledDatasets, [
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
  ]);

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

  store.set(state.clerkOfCourtDashboard.caseTypeBreakdownLabels, quarterLabels);
  store.set(
    state.clerkOfCourtDashboard.caseTypeBreakdownDatasets,
    Array.from(caseTypeMap.entries()).map(([label, data]) => ({ data, label })),
  );

  const totalProceedingSessions = stats.proceedingTypeCounts.reduce(
    (sum, r) => sum + r.count,
    0,
  );
  store.set(
    state.clerkOfCourtDashboard.procedureTypePieData,
    totalProceedingSessions > 0
      ? stats.proceedingTypeCounts.map(({ proceedingType, count }) => ({
          color: proceedingType === 'In Person' ? COLOR_BLUE : COLOR_YELLOW,
          name: proceedingType,
          value: count,
        }))
      : [],
  );

  const totalSessionTypeSessions = stats.sessionTypeCounts.reduce(
    (sum, r) => sum + r.count,
    0,
  );
  store.set(
    state.clerkOfCourtDashboard.sessionTypePieData,
    totalSessionTypeSessions > 0
      ? stats.sessionTypeCounts.map(({ sessionType, count }) => ({
          color: SESSION_TYPE_COLORS[sessionType] ?? '#CCCCCC',
          name: sessionType,
          value: count,
        }))
      : [],
  );

  store.set(
    state.clerkOfCourtDashboard.totalSessionsScheduled,
    totalSessionTypeSessions,
  );
};
