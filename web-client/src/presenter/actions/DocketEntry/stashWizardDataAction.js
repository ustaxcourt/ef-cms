import { state } from 'cerebral';

/**
 * stash wizard data in props
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object
 * @param {Object} providers.applicationContext the application context
 * @param {Object} providers.props the cerebral props object
 */
export const stashWizardDataAction = async ({ get, props }) => {
  const { primaryDocumentFileId, secondaryDocumentFileId } = props;

  const filedDocumentIds = get(state.screenMetadata.filedDocumentIds) || [];

  const {
    dateReceived,
    dateReceivedMonth,
    dateReceivedDay,
    dateReceivedYear,
    partyPrimary,
    partySecondary,
    partyRespondent,
  } = get(state.form);

  const supporting = get(state.screenMetadata.supporting);
  if (!supporting) {
    filedDocumentIds.push(primaryDocumentFileId);
    if (secondaryDocumentFileId) {
      filedDocumentIds.push(secondaryDocumentFileId);
    }
  }

  return {
    dateReceived,
    dateReceivedDay,
    dateReceivedMonth,
    dateReceivedYear,
    filedDocumentIds,
    partyPrimary,
    partyRespondent,
    partySecondary,
  };
};
