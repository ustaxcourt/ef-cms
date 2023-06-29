import { state } from '@web-client/presenter/app.cerebral';

/**
 * save a case note on a case
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const saveCaseNoteAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const caseNote = get(state.modal.notes);
  const docketNumber = get(state.caseDetail.docketNumber);

  const caseDetail = await applicationContext
    .getUseCases()
    .saveCaseNoteInteractor(applicationContext, {
      caseNote,
      docketNumber,
    });

  return {
    alertSuccess: {
      message: 'Note saved.',
    },
    caseDetail,
  };
};
