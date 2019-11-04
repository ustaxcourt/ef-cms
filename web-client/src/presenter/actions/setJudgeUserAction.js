import { state } from 'cerebral';

/**
 * sets the state.judgeUser to the props.judgeUser passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.judgeUser
 * @param {object} providers.props the cerebral props object used for getting the props.judgeUser
 */
export const setJudgeUserAction = ({ props, store }) => {
  if (props.judgeUser) {
    store.set(state.judgeUser, props.judgeUser);
  }
};
