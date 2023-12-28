import { FormattedPendingMotionWithWorksheet } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const getPendingMotionDocketEntriesAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  docketEntries: FormattedPendingMotionWithWorksheet[];
}> => {
  const judges = get(state.judgeActivityReport.filters.judges);

  const { docketEntries } = await applicationContext
    .getUseCases()
    .getPendingMotionDocketEntriesForCurrentJudgeInteractor(
      applicationContext,
      {
        judges,
      },
    );

  return {
    docketEntries,
  };
};
