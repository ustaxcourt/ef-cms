import { state } from '@web-client/presenter/app.cerebral';

export const setJudgeLastNamesAction = ({ get, store }: ActionProps) => {
  const { judgeName } = get(state.judgeActivityReport);
  const judges = get(state.judges);

  let judgesToQueryFor: string[] = [];

  if (judgeName === 'All Judges') {
    judgesToQueryFor = judges.map(judge => judge.name);
  } else if (judgeName === 'All Senior Judges') {
    judgesToQueryFor = judges
      .filter(judge => judge.isSeniorJudge === true)
      .map(judge => judge.name);
  } else if (judgeName === 'All Special Trial Judges') {
    judgesToQueryFor = judges
      .filter(judge => judge.judgeTitle?.includes('Special Trial Judge'))
      .map(judge => judge.name);
  } else if (judgeName === 'All Regular Judges') {
    judgesToQueryFor = judges
      .filter(judge => judge.isSeniorJudge === false)
      .filter(
        judge =>
          judge.judgeTitle === 'Judge' || judge.judgeTitle === 'Chief Judge',
      )
      .map(judge => judge.name);
  } else {
    judgesToQueryFor = [judgeName];
  }

  store.set(state.judgeActivityReport.filters.judges, judgesToQueryFor);
  store.set(state.judgeActivityReport.judgeNameToDisplayForHeader, judgeName);
};
