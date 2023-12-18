import { put } from './requests';

export const updateCaseContextInteractor = (
  applicationContext,
  { caseCaption, caseStatus, docketNumber, judgeData },
) => {
  return put({
    applicationContext,
    body: { caseCaption, caseStatus, judgeData },
    endpoint: `/case-meta/${docketNumber}/case-context`,
  });
};
