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

export type ClerkOfCourtTableRow = {
  label: string;
  total: string;
};

export type ClerkOfCourtDashboardStatsStatus = 'error' | 'loaded' | 'loading';

// each tab loads from its own endpoint, so each tab has its own data and status
export type ClerkOfCourtDashboardTab = 'cases' | 'petitions';

export type ClerkOfCourtDashboardTabStats<T> = {
  data: T;
  status: ClerkOfCourtDashboardStatsStatus;
};

export type DashboardClerkOfTheCourtHelper = {
  petitionsByMonthAndServiceTypeChartData: {
    color: string;
    data: number[];
    label: string;
  }[];
  petitionsByServiceTypePieData: {
    color: string;
    name: string;
    value: number;
  }[];
  petitionsByRepresentationPieData: {
    color: string;
    name: string;
    value: number;
  }[];
  totalPetitions: string;
  months: string[];
  casesYearLabel: string;
  petitionsYearLabel: string;
  openCasesPieData: ClerkOfCourtPieChartData[];
  totalOpenCases: string;
  casesClosedPieData: ClerkOfCourtPieChartData[];
  totalCasesClosed: string;
  casesClosedAndOnAppealByMonthChartData: ClerkOfCourtBarChartDataset[];
  casesClosedAndOnAppealLegendTotals: number[];
  casesMonths: string[];
};
