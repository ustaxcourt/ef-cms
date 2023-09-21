import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * calls interactor to add a paper filing
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
}: ActionProps) => {
  const { docketNumbers, isSavingForLater } = props;
  const { docketNumber } = get(state.caseDetail);
  const isFileAttachedNow = get(state.form.primaryDocumentFile);
  const clientConnectionId = get(state.clientConnectionId);
  const isFileAttached = get(state.form.isFileAttached) || isFileAttachedNow;

  let { docketEntryId } = props;

  if (!isFileAttached) {
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
    createdAt: documentMetadata.receivedAt,
    docketNumber,
    isFileAttached: !!isFileAttached,
    isPaper: true,
  };

  await applicationContext
    .getUseCases()
    .addPaperFilingInteractor(applicationContext, {
      clientConnectionId,
      consolidatedGroupDocketNumbers: docketNumbers,
      docketEntryId,
      documentMetadata,
      isSavingForLater,
    });
};
