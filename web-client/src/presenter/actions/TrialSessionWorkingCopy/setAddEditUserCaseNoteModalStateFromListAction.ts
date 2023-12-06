import { get as _get, find } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the state for the add edit user's notes modal
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setAddEditUserCaseNoteModalStateFromListAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { docketNumber, docketNumberWithSuffix } = props;

  const notes = _get(get(state.trialSessionWorkingCopy.userNotes), [
    docketNumber,
    'notes',
  ]);

  const caseDetail = find(get(state.trialSession.calendaredCases), {
    docketNumber,
  });

  const caseTitle = applicationContext.getCaseTitle(caseDetail.caseCaption);

  store.set(state.modal.caseTitle, caseTitle);
  store.set(state.modal.docketNumber, docketNumber);
  store.set(state.modal.docketNumberWithSuffix, docketNumberWithSuffix);
  store.set(state.modal.notes, notes);
};
