import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { DocketEntryWithWorksheet } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const getPendingMotionDocketEntriesForCurrentJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  docketEntries: DocketEntryWithWorksheet[];
}> => {
  console.log('getPendingMotionDocketEntriesForCurrentJudgeAction');
  const { name } = get(state.judgeUser);
  console.log('name', name);

  const { docketEntries } = await applicationContext
    .getUseCases()
    .getPendingMotionDocketEntriesForCurrentJudgeInteractor(
      applicationContext,
      {
        judges: [name],
        statuses: [CASE_STATUS_TYPES.calendared],
      },
    );

  console.log('docketEntries', docketEntries);

  return {
    docketEntries,
  };
};
