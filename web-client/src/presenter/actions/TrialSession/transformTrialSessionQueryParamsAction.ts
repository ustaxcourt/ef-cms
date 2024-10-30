import { state } from '@web-client/presenter/app.cerebral';

export const transformTrialSessionQueryParamsAction = ({
  get,
  props,
}: ActionProps) => {
  if (props.judgeId) {
    const judges = get(state.legacyAndCurrentJudges);
    const currentJudge = judges.find(judge => judge.userId === props.judgeId);
    if (currentJudge) {
      return {
        judges: {
          action: 'add',
          judge: { name: currentJudge.name, userId: currentJudge.userId },
        },
      };
    }
  }
};
