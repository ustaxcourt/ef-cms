import { state } from '@web-client/presenter/app.cerebral';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * sets the totalPdfs on the state.paperServiceStatusState state.
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store used for setting state.progressIndicator.waitingForResponse
 */
export const resetPaperServiceStatusAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.paperServiceStatusState, {
    pdfsAppended: 0,
    totalPdfs: props.totalPdfs,
  });
};
