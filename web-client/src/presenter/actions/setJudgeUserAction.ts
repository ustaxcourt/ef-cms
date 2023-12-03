import { RawUser } from '@shared/business/entities/User';
import { state } from '@web-client/presenter/app.cerebral';

export const setJudgeUserAction = ({
  props,
  store,
}: ActionProps<{ judgeUser: RawUser }>) => {
  store.set(state.judgeUser, props.judgeUser);
};
