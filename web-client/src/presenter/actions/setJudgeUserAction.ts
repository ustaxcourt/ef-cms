import { state } from '@web-client/presenter/app.cerebral';

export const setJudgeUserAction = ({
  applicationContext,
  props,
  store,
}: ActionProps<{ judgeUser?: RawUser }>) => {
  const user = applicationContext.getCurrentUser();
  const judgeUser = props.judgeUser || user;

  store.set(state.judgeUser, judgeUser);
};
