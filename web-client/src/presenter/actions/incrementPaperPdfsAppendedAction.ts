import { state } from '@web-client/presenter/app.cerebral';

/**
 * increments the appended state
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store used for setting state.progressIndicator.waitingForResponse
 */
export const incrementPaperPdfsAppendedAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.paperServiceStatusState.pdfsAppended, props.pdfsAppended);
};
