export const validateUploadedPdfAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { documentStorageId } = props;

  await applicationContext
    .getUseCases()
    .validatePdfInteractor(applicationContext, {
      key: documentStorageId,
    });
};
