import { state } from '@web-client/presenter/app.cerebral';

/**
 * Clears any existing modal form state and sets up the modal for opening
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const openNewMinuteSheetModalAction = ({
  get,
  store,
}: ActionProps) => {
  const trialSessionId = get(state.trialSession.trialSessionId);

  store.unset(state.modal.form);
  store.unset(state.modal.caseInfo);
  store.set(state.modal.trialSessionId, trialSessionId);
};
