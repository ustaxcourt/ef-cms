import { get as _get } from 'lodash';
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
  const { docketNumber } = props;

  const notes = _get(get(state.trialSessionWorkingCopy.caseMetadata), [
    docketNumber,
    'notes',
  ]);

  const caseCaption = get(state.caseDetail.caseCaption);
  const caseCaptionNames = applicationContext.getCaseCaptionNames(
    caseCaption || '',
  );

  store.set(state.modal.caseCaptionNames, caseCaptionNames);
  store.set(state.modal.docketNumber, docketNumber);
  store.set(state.modal.notes, notes);
};
