import { state } from 'cerebral';

export const dashboardExternalHelper = (get, applicationContext) => {
  const cases = get(state.cases);
  const user = applicationContext.getCurrentUser() || {};

  return {
    showCaseList: cases.length > 0,
    showCaseSearch: ['practitioner', 'respondent'].includes(user.role),
    showWhatToExpect: cases.length === 0,
  };
};
