import { state } from 'cerebral';

export default ({ get }) => {
  const formattedCaseId = get(state.formattedSearchParams);
  return { caseId: formattedCaseId };
};
