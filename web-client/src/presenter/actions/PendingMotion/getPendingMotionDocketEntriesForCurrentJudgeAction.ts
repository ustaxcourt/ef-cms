import { FormattedPendingMotionWithWorksheet } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const getPendingMotionDocketEntriesForCurrentJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  docketEntries: FormattedPendingMotionWithWorksheet[];
}> => {
  const { name } = get(state.judgeUser);

  const { docketEntries } = await applicationContext
    .getUseCases()
    .getPendingMotionDocketEntriesForCurrentJudgeInteractor(
      applicationContext,
      {
        judge: name,
      },
    );

  return {
    docketEntries,
  };
};
