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
  year: string;
};
