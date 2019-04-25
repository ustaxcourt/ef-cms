import { state } from 'cerebral';

export const dashboardPetitionerHelper = get => {
  const cases = get(state.cases);
  const user = get(state.user);

  return {
    showCaseList: cases.length > 0,
    showCaseSearch: user.role === 'practitioner',
    showWhatToExpect: cases.length === 0,
  };
};
