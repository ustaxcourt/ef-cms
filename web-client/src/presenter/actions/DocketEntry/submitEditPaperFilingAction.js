import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * calls interactor to edit a paper filing
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {object} docketEntryId of the paper filing, boolean if a coversheet needs to be generated,
 *   url of paper service pdf if applicable
 */
export const submitEditPaperFilingAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { docketNumbers: consolidatedGroupDocketNumbers, isSavingForLater } =
    props;

  const formData = get(state.form);
  const docketEntryId = get(state.docketEntryId);
  const { docketNumber } = get(state.caseDetail);
  const isFileAttachedNow = get(state.form.primaryDocumentFile);

  const isFileAttached = !!(
    get(state.form.isFileAttached) || isFileAttachedNow
  );
  const formDataWithoutPdf = omit(formData, ['primaryDocumentFile']);

  const documentMetadata = {
    ...formDataWithoutPdf,
    createdAt: formDataWithoutPdf.dateReceived,
    docketNumber,
    isFileAttached,
    isPaper: true,
    receivedAt: formDataWithoutPdf.dateReceived,
  };

  await applicationContext
    .getUseCases()
    .editPaperFilingInteractor(applicationContext, {
      consolidatedGroupDocketNumbers,
      docketEntryId,
      documentMetadata,
      isSavingForLater,
    });

  return {
    docketEntryId,
    generateCoversheet: isFileAttached && !isSavingForLater,
  };
};
