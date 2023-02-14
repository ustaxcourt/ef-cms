/**
 * Validate uploaded PDF
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 */
export const validateUploadedPdfAction = async ({
  applicationContext,
  props,
}) => {
  const { docketEntryId } = props;

  await applicationContext
    .getUseCases()
    .getStatusOfVirusScanInteractor(applicationContext, {
      key: docketEntryId,
    });

  await applicationContext
    .getUseCases()
    .validatePdfInteractor(applicationContext, {
      key: docketEntryId,
    });
};
