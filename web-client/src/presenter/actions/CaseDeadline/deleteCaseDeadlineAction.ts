import { state } from '@web-client/presenter/app.cerebral';

/**
 * resets the state.form which is used throughout the app for storing html form values
 * state.form is used throughout the app for storing html form values
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @returns {object} the success path
 */
export const deleteCaseDeadlineAction = async ({
  applicationContext,
  get,
  path,
  store,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const caseDeadlineId = get(state.form.caseDeadlineId);

  const updatedCase = await applicationContext
    .getUseCases()
    .deleteCaseDeadlineInteractor(applicationContext, {
      caseDeadlineId,
      docketNumber,
    });

  setAutomaticBlockedFieldsOnState(updatedCase, store);

  return path.success({
    alertSuccess: {
      message: 'Deadline removed.',
    },
  });
};

const setAutomaticBlockedFieldsOnState = (updatedCase, store) => {
  store.set(state.caseDetail.automaticBlocked, updatedCase.automaticBlocked);
  store.set(
    state.caseDetail.automaticBlockedDate,
    updatedCase.automaticBlockedDate,
  );
  store.set(
    state.caseDetail.automaticBlockedReason,
    updatedCase.automaticBlockedReason,
  );
};
