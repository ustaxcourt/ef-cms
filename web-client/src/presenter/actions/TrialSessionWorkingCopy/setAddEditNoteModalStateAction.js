import { state } from 'cerebral';

/**
 * set the state for the add edit notes modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setAddEditNoteModalStateAction = ({ get, props, store }) => {
  const { docketNumber } = props;
  const notes = get(
    `state.trialSessionWorkingCopy.caseMetadata.${docketNumber}.notes`,
  );

  store;
  store.set(state.modal.docketNumber, docketNumber);
  store.set(state.modal.notes, notes);
};
