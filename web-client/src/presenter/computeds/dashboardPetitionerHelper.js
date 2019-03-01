import { state } from 'cerebral';

export const dashboardPetitionerHelper = get => {
  const cases = get(state.cases);
  return {
    showCaseList: cases.length > 0,
    showWhatToExpect: cases.length === 0,
  };
};
