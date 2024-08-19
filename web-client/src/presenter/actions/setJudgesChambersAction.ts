import { state } from '@web-client/presenter/app.cerebral';

export const setJudgesChambersAction = ({
  props,
  store,
}: ActionProps<{ judgesChambers: any }>) => {
  console.log('props.users', props.judgesChambers);
  console.trace();
  store.set(state.judgesChambers, props.judgesChambers);
};
