import { state } from '@web-client/presenter/app.cerebral';
import { getDocumentStorageId } from '@shared/business/utilities/getDocumentStorageId';

export const getPDFForPreviewTabAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  if (props.file.name) {
    return props;
  }
  const caseDetail = get(state.caseDetail);

  const documentStorageId = getDocumentStorageId({
    caseDetail,
    docketEntryId: props.file.docketEntryId,
  });

  const pdfObj = await applicationContext
    .getUseCases()
    .loadPDFForPreviewInteractor(applicationContext, {
      documentStorageId,
      docketNumber: caseDetail.docketNumber,
    });
  return { file: pdfObj };
};
