import { state } from '@web-client/presenter/app.cerebral';

/**
 * increments state.noticeStatusState.casesProcessed
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store used for setting state.progressIndicator.waitingForResponse
 */
export const incrementProcessedCasesAction = ({ get, store }: ActionProps) => {
  store.set(
    state.noticeStatusState.casesProcessed,
    get(state.noticeStatusState.casesProcessed) + 1,
  );
};
