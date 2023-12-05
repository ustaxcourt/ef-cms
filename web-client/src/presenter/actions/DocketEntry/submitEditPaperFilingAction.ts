import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * calls interactor to edit a paper filing
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 */
export const submitEditPaperFilingAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const { docketNumbers: consolidatedGroupDocketNumbers, isSavingForLater } =
    props;

  const formData = get(state.form);
  const docketEntryId = get(state.docketEntryId);
  const { docketNumber } = get(state.caseDetail);
  const clientConnectionId = get(state.clientConnectionId);
  const isFileAttachedNow = get(state.form.primaryDocumentFile);

  const isFileAttached = !!(
    get(state.form.isFileAttached) || isFileAttachedNow
  );
  const formDataWithoutPdf = omit(formData, ['primaryDocumentFile']);

  const documentMetadata = {
    ...formDataWithoutPdf,
    createdAt: formDataWithoutPdf.receivedAt,
    docketNumber,
    isFileAttached,
    isPaper: true,
  };

  await applicationContext
    .getUseCases()
    .editPaperFilingInteractor(applicationContext, {
      clientConnectionId,
      consolidatedGroupDocketNumbers,
      docketEntryId,
      documentMetadata,
      isSavingForLater,
    });
};
