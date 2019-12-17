import { state } from 'cerebral';

/**
 * set the state for the add edit procedural notes modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setAddEditProceduralNoteModalStateFromDetailAction = ({
  applicationContext,
  get,
  store,
}) => {
  const {
    caseCaption,
    caseId,
    docketNumber,
    docketNumberSuffix,
    proceduralNote,
  } = get(state.caseDetail);

  const caseCaptionNames = applicationContext.getCaseCaptionNames(
    caseCaption || '',
  );

  store.set(
    state.modal.docketNumber,
    `${docketNumber}${docketNumberSuffix ? docketNumberSuffix : ''}`,
  );
  store.set(state.modal.caseCaptionNames, caseCaptionNames);
  store.set(state.modal.caseId, caseId);
  store.set(state.modal.notes, proceduralNote);
};
