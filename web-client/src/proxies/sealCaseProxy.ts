import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const sealCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  return put({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/seal`,
  });
};
