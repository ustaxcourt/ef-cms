import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the total cases on the state.noticeStatusState
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store used for setting state.progressIndicator.waitingForResponse
 */
export const resetNoticeStatusAction = ({ props, store }: ActionProps) => {
  store.set(state.noticeStatusState, {
    casesProcessed: 0,
    totalCases: props.totalCases,
  });
};
