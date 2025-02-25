import { JudgeChambersInfo } from '@web-client/presenter/actions/getJudgesChambersAction';
import { state } from '@web-client/presenter/app.cerebral';

export const setJudgesChambersAction = ({
  props,
  store,
}: ActionProps<{ judgesChambers: JudgeChambersInfo[] }>) => {
  store.set(state.judgesChambers, props.judgesChambers);
};
