import { state } from '@web-client/presenter/app.cerebral';

export const setJudgesChambersAction = ({
  props,
  store,
}: ActionProps<{ judgesChambers: any }>) => {
  store.set(state.judgesChambers, props.judgesChambers);
};
