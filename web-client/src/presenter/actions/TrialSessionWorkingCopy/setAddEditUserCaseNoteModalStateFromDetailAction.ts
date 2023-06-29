import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the state for the add edit notes modal
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setAddEditUserCaseNoteModalStateFromDetailAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const currentUser = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  const { caseCaption, docketNumber, docketNumberWithSuffix } = get(
    state.caseDetail,
  );
  const notes = get(state.judgesNote.notes);
  const caseTitle = applicationContext.getCaseTitle(caseCaption || '');
  const notesLabel =
    currentUser.role === USER_ROLES.trialClerk ? 'Notes' : 'Judge’s notes';

  store.set(state.modal.caseTitle, caseTitle);
  store.set(state.modal.docketNumber, docketNumber);
  store.set(state.modal.docketNumberWithSuffix, docketNumberWithSuffix);
  store.set(state.modal.notes, notes);
  store.set(state.modal.notesLabel, notesLabel);
};
