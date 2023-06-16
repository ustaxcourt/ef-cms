import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the state for the add edit case notes modal
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setAddEditCaseNoteModalStateFromDetailAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { caseCaption, caseNote, docketNumber, docketNumberSuffix } = get(
    state.caseDetail,
  );

  const caseTitle = applicationContext.getCaseTitle(caseCaption || '');

  store.set(
    state.modal.docketNumber,
    `${docketNumber}${docketNumberSuffix || ''}`,
  );
  store.set(state.modal.caseTitle, caseTitle);
  store.set(state.modal.notes, caseNote);
};
