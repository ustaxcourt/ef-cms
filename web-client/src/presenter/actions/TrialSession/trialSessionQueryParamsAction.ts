import { state } from '@web-client/presenter/app.cerebral';

export const trialSessionQueryParamsAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  if (props.judgeId) {
    const judges = get(state.legacyAndCurrentJudges);
    const currentJudge = judges.find(judge => judge.userId === props.judgeId);
    if (currentJudge) {
      store.set(state.trialSessionsPage.filters.judges, {
        [currentJudge.userId]: {
          name: currentJudge.name,
          userId: currentJudge.userId,
        },
      });
    }
  }
};
