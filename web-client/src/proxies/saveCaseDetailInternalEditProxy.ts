import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const saveCaseDetailInternalEditInteractor = (
  applicationContext: ClientApplicationContext,
  { caseToUpdate },
) => {
  return put({
    applicationContext,
    body: caseToUpdate,
    endpoint: `/cases/${caseToUpdate.docketNumber}`,
  });
};
