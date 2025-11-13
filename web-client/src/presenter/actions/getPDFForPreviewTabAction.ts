import { state } from '@web-client/presenter/app.cerebral';

export const getPDFForPreviewTabAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  if (props.file.name) {
    return props;
  }
  const docketNumber = get(state.caseDetail.docketNumber);

  const pdfObj = await applicationContext
    .getUseCases()
    .loadPDFForPreviewInteractor(applicationContext, {
      documentStorageId: props.documentStorageId,
      docketNumber,
    });
  return { file: pdfObj };
};
