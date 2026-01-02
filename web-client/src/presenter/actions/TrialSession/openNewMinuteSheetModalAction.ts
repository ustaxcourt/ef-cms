import { state } from '@web-client/presenter/app.cerebral';

/**
 * Clears any existing modal form state, fetches unscheduled minute sheets,
 * and sets up the modal for opening
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const openNewMinuteSheetModalAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const trialSessionId = get(state.trialSession.trialSessionId);

  store.unset(state.modal.form);
  store.unset(state.modal.caseInfo);
  store.set(state.modal.trialSessionId, trialSessionId);

  try {
    const unscheduledMinuteSheets = await applicationContext
      .getUseCases()
      .getUnscheduledMinuteSheetsInteractor({
        trialSessionId,
      });

    store.set(state.modal.editUnscheduledMinutesList, unscheduledMinuteSheets);
  } catch (error) {
    // If fetching fails, just set an empty list - don't block opening the modal
    store.set(state.modal.editUnscheduledMinutesList, []);
  }
};
