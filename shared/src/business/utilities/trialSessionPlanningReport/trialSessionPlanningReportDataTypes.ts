export type PreviousTerm = {
  term: string;
  termDisplay: string;
  year: number;
};

export type TrialLocationData = {
  allCaseCount: number;
  previousTermsData: string[][];
  regularCaseCount: number;
  smallCaseCount: number;
  specialCaseCount: number;
  stateAbbreviation: string;
  trialCityState: string;
  blockedCaseCount: number;
  lastVisitedDate?: string;
};
