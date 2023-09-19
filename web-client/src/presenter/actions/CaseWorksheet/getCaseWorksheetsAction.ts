import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';

export const getCaseWorksheetsAction = async ({
  applicationContext,
}: ActionProps): Promise<{ worksheets: RawCaseWorksheet[] }> => {
  const worksheets = await applicationContext
    .getUseCases()
    .getCaseWorksheetsForJudgeInteractor(applicationContext);

  return {
    worksheets,
  };
};
