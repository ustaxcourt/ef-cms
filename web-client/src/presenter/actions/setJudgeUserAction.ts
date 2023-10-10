import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.judgeUser to the props.judgeUser passed in.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.judgeUser
 * @param {object} providers.props the cerebral props object used for getting the props.judgeUser
 */
export const setJudgeUserAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const user = applicationContext.getCurrentUser();
  const judgeUser = props.judgeUser || user;
  if (judgeUser) {
    store.set(state.judgeUser, judgeUser);
  } else {
    store.unset(state.judgeUser);
  }
};
