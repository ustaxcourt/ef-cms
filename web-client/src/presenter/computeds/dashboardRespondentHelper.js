import { state } from 'cerebral';

export const dashboardRespondentHelper = get => {
  const cases = get(state.cases);
  return {
    showCaseList: cases.length > 0,
    showNoCasesMessage: cases.length === 0,
  };
};
