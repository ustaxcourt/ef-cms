import { state } from 'cerebral';

export const dashboardRespondentHelper = get => {
  const cases = get(state.cases);
  return {
    showNoCasesMessage: cases.length === 0,
    showCaseList: cases.length > 0,
  };
};
