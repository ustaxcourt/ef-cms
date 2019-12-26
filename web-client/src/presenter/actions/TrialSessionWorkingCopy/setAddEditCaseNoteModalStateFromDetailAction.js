import { state } from 'cerebral';

/**
 * set the state for the add edit notes modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setAddEditCaseNoteModalStateFromDetailAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { caseId } = props;

  const notes = get(state.caseDetail.caseNote.notes);
  const { caseCaption, docketNumber, docketNumberSuffix } = get(
    state.caseDetail,
  );
  const caseCaptionNames = applicationContext.getCaseCaptionNames(
    caseCaption || '',
  );

  store.set(
    state.modal.docketNumber,
    `${docketNumber}${docketNumberSuffix ? docketNumberSuffix : ''}`,
  );
  store.set(state.modal.caseCaptionNames, caseCaptionNames);
  store.set(state.modal.caseId, caseId);
  store.set(state.modal.notes, notes);
};
