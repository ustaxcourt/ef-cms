import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateCaseDetailsInteractor = (
  applicationContext: ClientApplicationContext,
  { caseDetails, docketNumber },
) => {
  return put({
    applicationContext,
    body: {
      caseDetails,
    },
    endpoint: `/case-parties/${docketNumber}/case-details`,
  });
};
