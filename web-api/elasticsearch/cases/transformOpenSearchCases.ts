import { CaseKysely } from '@web-api/persistence/postgres/cases/schema';

export const transformOpenSearchCases = (
  caseData: CaseKysely | CaseKysely[],
) => {
  const cases = Array.isArray(caseData) ? caseData : [caseData];
  return cases.map(c => c.docketNumber);
};
