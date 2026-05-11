export type ClerkOfCourtBarChartData = {
  label: string;
  value: number;
  color?: string;
};

export type ClerkOfCourtBarChartDataset = {
  label: string;
  data: number[];
  color?: string;
};

export type ClerkOfCourtLineChartDataset = {
  label: string;
  data: (number | null)[];
  color?: string;
};

export type ClerkOfCourtPieChartData = {
  name: string;
  value: number;
  color?: string;
};

export type ClerkOfCourtDashboardState = {
  specialSessionsByLocation: ClerkOfCourtBarChartData[];
  petitionsByMonthLabels: string[];
  petitionsByMonthDatasets: ClerkOfCourtBarChartDataset[];
  closedCasesLabels: string[];
  closedCasesDatasets: ClerkOfCourtBarChartDataset[];
  casesFiledLabels: string[];
  casesFiledDatasets: ClerkOfCourtLineChartDataset[];
  caseTypeBreakdownLabels: string[];
  caseTypeBreakdownDatasets: ClerkOfCourtLineChartDataset[];
  procedureTypePieData: ClerkOfCourtPieChartData[];
  sessionTypePieData: ClerkOfCourtPieChartData[];
  totalSessionsScheduled: number;
};

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

export const initialClerkOfCourtDashboardState: ClerkOfCourtDashboardState = {
  caseTypeBreakdownDatasets: [],
  caseTypeBreakdownLabels: [],
  casesFiledDatasets: [],
  casesFiledLabels: [],
  closedCasesDatasets: [],
  closedCasesLabels: [],
  petitionsByMonthDatasets: [],
  petitionsByMonthLabels: MONTHS,
  procedureTypePieData: [],
  sessionTypePieData: [],
  specialSessionsByLocation: [],
  totalSessionsScheduled: 0,
};
