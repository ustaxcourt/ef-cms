import { state } from 'cerebral';

/**
 * restore wizard data
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.get the cerebral get function
 * @param {Object} providers.store the cerebral store object
 * @param {Object} providers.props the cerebral props object
 */
export const restoreWizardDataAction = async ({ get, store, props }) => {
  const {
    filedDocumentIds,
    dateReceived,
    dateReceivedMonth,
    dateReceivedDay,
    dateReceivedYear,
    lodged,
    partyPrimary,
    partySecondary,
    partyRespondent,
  } = props;
  store.set(state.screenMetadata.filedDocumentIds, filedDocumentIds);

  const form = {
    ...get(state.form),
    dateReceived,
    dateReceivedMonth,
    dateReceivedDay,
    dateReceivedYear,
    lodged,
    partyPrimary,
    partySecondary,
    partyRespondent,
  };

  store.set(state.form, form);
};
