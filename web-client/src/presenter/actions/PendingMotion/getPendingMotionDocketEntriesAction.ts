import { FormattedPendingMotionWithWorksheet } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const getJudgesFilters = (get: ActionProps['get']) => {
  const judges = get(state.judges);
  const judgeName = get(state.judgeActivityReport.filters.judgeName);

  if (judgeName === 'All Judges') {
    return judges;
  }
  if (judgeName === 'All Senior Judges') {
    return judges.filter(judge => judge.isSeniorJudge === true);
  }

  if (judgeName === 'All Special Trial Judges') {
    return judges.filter(
      judge => judge.judgeTitle?.includes('Special Trial Judge'),
    );
  }

  if (judgeName === 'All Regular Judges') {
    return judges
      .filter(judge => judge.isSeniorJudge === false)
      .filter(
        judge =>
          judge.judgeTitle === 'Judge' || judge.judgeTitle === 'Chief Judge',
      );
  }

  const judge = judges.find(j => j.name === judgeName);
  return [judge!];
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
        judgeIds: getJudgesFilters(get).map(judge => judge.userId),
      },
    );

  return {
    docketEntries,
  };
};
