import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * calls interactor to add or edit a paper filing
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitAddPaperFilingAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { docketNumbers, isSavingForLater, primaryDocumentFileId } = props;
  const { docketNumber } = get(state.caseDetail);
  const isFileAttachedNow = get(state.form.primaryDocumentFile);
  const clientConnectionId = get(state.clientConnectionId);
  const isFileAttached = get(state.form.isFileAttached) || isFileAttachedNow;

  let docketEntryId;

  if (isFileAttached) {
    docketEntryId = primaryDocumentFileId;
  } else {
    docketEntryId = applicationContext.getUniqueId();
  }

  let documentMetadata = omit(
    {
      ...get(state.form),
    },
    ['primaryDocumentFile'],
  );

  documentMetadata = {
    ...documentMetadata,
    createdAt: documentMetadata.dateReceived,
    docketNumber,
    isFileAttached: !!isFileAttached,
    isPaper: true,
    receivedAt: documentMetadata.dateReceived,
  };

  await applicationContext
    .getUseCases()
    .addPaperFilingInteractor(applicationContext, {
      clientConnectionId,
      consolidatedGroupDocketNumbers: docketNumbers,
      documentMetadata,
      isSavingForLater,
      primaryDocumentFileId: docketEntryId,
    });

  return {
    docketEntryId,
    docketNumber,
    overridePaperServiceAddress: true,
  };
};
