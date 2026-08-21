import { TAssociatedCase } from '@shared/business/useCases/getCasesForUserInteractor';
import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCasesForUserInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<{
  openCaseList: TAssociatedCase[];
  closedCaseList: TAssociatedCase[];
}> => {
  return get({
    applicationContext,
    endpoint: '/cases',
  });
};
