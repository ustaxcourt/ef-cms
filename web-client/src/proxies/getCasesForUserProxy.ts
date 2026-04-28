import { TAssociatedCase } from '@shared/business/useCases/getCasesForUserInteractor';
import { get } from './requests';

export const getCasesForUserInteractor = (
  applicationContext,
): Promise<{
  openCaseList: TAssociatedCase[];
  closedCaseList: TAssociatedCase[];
}> => {
  return get({
    applicationContext,
    endpoint: '/cases',
  });
};
