import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateCaseContextInteractor = (
  applicationContext: ClientApplicationContext,
  { caseCaption, caseStatus, docketNumber, judgeData },
) => {
  return put({
    applicationContext,
    body: { caseCaption, caseStatus, judgeData },
    endpoint: `/case-meta/${docketNumber}/case-context`,
  });
};
