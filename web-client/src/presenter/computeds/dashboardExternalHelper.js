import { state } from 'cerebral';

export const dashboardExternalHelper = get => {
  const cases = get(state.cases);
  const user = get(state.user) || {};

  return {
    showCaseList: cases.length > 0,
    showCaseSearch: ['practitioner', 'respondent'].includes(user.role),
    showWhatToExpect: cases.length === 0,
  };
};
