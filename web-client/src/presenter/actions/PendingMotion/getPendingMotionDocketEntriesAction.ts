import { FormattedPendingMotionWithWorksheet } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const getJudgesFilters = (get: ActionProps['get']) => {
  const judges = get(state.judges);
  const judgeName = get(state.judgeActivityReport.filters.judgeName);

  let judgesToQueryFor: string[] = [];

  if (judgeName === 'All Judges') {
    judgesToQueryFor = judges.map(judge => judge.userId);
  } else if (judgeName === 'All Senior Judges') {
    judgesToQueryFor = judges
      .filter(judge => judge.isSeniorJudge === true)
      .map(judge => judge.userId);
  } else if (judgeName === 'All Special Trial Judges') {
    judgesToQueryFor = judges
      .filter(judge => judge.judgeTitle?.includes('Special Trial Judge'))
      .map(judge => judge.userId);
  } else if (judgeName === 'All Regular Judges') {
    judgesToQueryFor = judges
      .filter(judge => judge.isSeniorJudge === false)
      .filter(
        judge =>
          judge.judgeTitle === 'Judge' || judge.judgeTitle === 'Chief Judge',
      )
      .map(judge => judge.userId);
  } else {
    const judge = judges.find(j => j.name === judgeName);
    judgesToQueryFor = [judge!.userId];
  }
  return judgesToQueryFor;
};

export const getPendingMotionDocketEntriesAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  docketEntries: FormattedPendingMotionWithWorksheet[];
}> => {
  const { docketEntries } = await applicationContext
    .getUseCases()
    .getPendingMotionDocketEntriesForCurrentJudgeInteractor(
      applicationContext,
      {
        judgeIds: getJudgesFilters(get),
      },
    );

  return {
    docketEntries,
  };
};
