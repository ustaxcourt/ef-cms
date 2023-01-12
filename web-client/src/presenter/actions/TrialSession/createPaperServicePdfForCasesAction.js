/**
 * fix
 */
export const createPaperServicePdfForCasesAction = async ({
  applicationContext,
  props,
}) => {
  let { calendaredCasePdfDataArray } = props;

  await applicationContext
    .getUseCases()
    .generateTrialSessionPaperServicePdfInteractor(applicationContext, {
      calendaredCasePdfDataArray,
    });
};
