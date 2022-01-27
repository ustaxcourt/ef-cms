import { state } from 'cerebral';

/**
 * Defaults state.modal.docketEntrySealedTo to DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setDefaultDocketEntrySealedToAction = ({
  applicationContext,
  store,
}) => {
  const { DOCKET_ENTRY_SEALED_TO_TYPES } = applicationContext.getConstants();

  store.set(
    state.modal.docketEntrySealedTo,
    DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
  );
};
