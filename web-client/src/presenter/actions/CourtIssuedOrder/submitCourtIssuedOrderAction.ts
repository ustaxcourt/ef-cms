import { CaseWithSelectionInfo } from '@shared/business/utilities/getSelectedConsolidatedCasesToMultiDocketOn';
import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const submitCourtIssuedOrderAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{
  primaryDocumentFileId: string;
  createOrderSelectedCases?;
}>) => {
  let caseDetail;
  const { docketNumber } = get(state.caseDetail);
  const { primaryDocumentFileId: docketEntryId } = props;
  const formData = get(state.form);
  const { docketEntryIdToEdit } = formData;
  const consolidatedCasesToMultiDocketOn =
    props.createOrderSelectedCases ||
    get(state.modal.form.consolidatedCasesToMultiDocketOn);

  const consolidatedCasesToMultiDocketOnMetaData: CaseWithSelectionInfo[] = (
    consolidatedCasesToMultiDocketOn || []
  ).map(caseInfo => ({
    checked: caseInfo.checked,
    docketNumberWithSuffix: caseInfo.docketNumberWithSuffix,
  }));

  const addedDocketNumbers = applicationContext
    .getUtilities()
    .getSelectedConsolidatedCasesToMultiDocketOn(
      consolidatedCasesToMultiDocketOnMetaData,
    );

  let documentMetadata = omit(formData, [
    'primaryDocumentFile',
    'docketEntryIdToEdit',
  ]);

  documentMetadata.docketNumber = docketNumber;

  documentMetadata.draftOrderState = {
    ...documentMetadata,
    addedDocketNumbers,
  };

  await applicationContext
    .getUseCases()
    .validatePdfInteractor(applicationContext, {
      key: docketEntryId,
    });

  if (docketEntryIdToEdit) {
    caseDetail = await applicationContext
      .getUseCases()
      .updateCourtIssuedOrderInteractor(applicationContext, {
        docketEntryIdToEdit,
        documentMetadata,
      });
  } else {
    caseDetail = await applicationContext
      .getUseCases()
      .fileCourtIssuedOrderInteractor(applicationContext, {
        documentMetadata,
        primaryDocumentFileId: docketEntryId,
      });
  }

  return {
    caseDetail,
    docketEntryId,
    docketNumber,
    eventCode: documentMetadata.eventCode,
  };
};
