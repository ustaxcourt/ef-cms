import { state } from 'cerebral';

export const dashboardPetitionerHelper = get => {
  const cases = get(state.cases);
  return {
    showWhatToExpect: cases.length === 0,
    showCaseList: cases.length > 0,
  };
};
