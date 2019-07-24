import { state } from 'cerebral';

/**
 * stash wizard data in props
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 */
export const stashWizardDataAction = ({ get, props, store }) => {
  const supporting = get(state.screenMetadata.supporting);
  if (!supporting) {
    const { primaryDocumentFileId, secondaryDocumentFileId } = props;

    const {
      dateReceived,
      dateReceivedDay,
      dateReceivedMonth,
      dateReceivedYear,
      lodged,
      partyPrimary,
      partyRespondent,
      partySecondary,
      practitioner,
    } = get(state.form);

    const documentMetadata = {
      dateReceived,
      dateReceivedDay,
      dateReceivedMonth,
      dateReceivedYear,
      partyPrimary,
      partyRespondent,
      partySecondary,
      practitioner,
    };

    store.set(state.screenMetadata.primary, { ...documentMetadata, lodged });

    const secondaryDocument = get(state.form.secondaryDocument);
    if (secondaryDocument) {
      store.set(state.screenMetadata.secondary, {
        ...documentMetadata,
        lodged: true,
      });
    }

    const filedDocumentIds = [];
    filedDocumentIds.push(primaryDocumentFileId);
    if (secondaryDocumentFileId) {
      filedDocumentIds.push(secondaryDocumentFileId);
    }
    store.set(state.screenMetadata.filedDocumentIds, filedDocumentIds);
  }
};
