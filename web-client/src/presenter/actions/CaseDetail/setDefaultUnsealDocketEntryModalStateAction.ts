import { state } from 'cerebral';

/**
 * sets the state.modal to have the default values needed for unsealing a docket entry in the modal.
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store
 */
export const setDefaultUnsealDocketEntryModalStateAction = ({
  props,
  store,
}) => {
  store.set(state.modal.docketEntryId, props.docketEntryId);
};
