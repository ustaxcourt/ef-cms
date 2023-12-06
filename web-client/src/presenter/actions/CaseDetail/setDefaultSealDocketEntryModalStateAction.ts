import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.modal to have the default values needed for sealing a docket entry in the modal.
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store
 */
export const setDefaultSealDocketEntryModalStateAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const { DOCKET_ENTRY_SEALED_TO_TYPES } = applicationContext.getConstants();

  store.set(
    state.modal.docketEntrySealedTo,
    DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
  );

  store.set(state.modal.docketEntryId, props.docketEntryId);
};
