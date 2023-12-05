import { TAssociatedCase } from '@shared/business/useCases/getCasesForUserInteractor';

export const getOpenAndClosedCasesForUserAction = async ({
  applicationContext,
}: ActionProps): Promise<{
  openCaseList: TAssociatedCase[];
  closedCaseList: TAssociatedCase[];
}> => {
  const { closedCaseList, openCaseList } = await applicationContext
    .getUseCases()
    .getCasesForUserInteractor(applicationContext);

  return { closedCaseList, openCaseList };
};
