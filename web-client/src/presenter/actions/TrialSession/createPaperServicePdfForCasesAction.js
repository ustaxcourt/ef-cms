/**
 * fix
 */
export const createPaperServicePdfForCasesAction = async ({
  applicationContext,
  props,
}) => {
  let { calendaredCasePdfDataArray } = props;

  console.log(calendaredCasePdfDataArray, './............');

  const { docketEntryId, hasPaper, url } = await applicationContext
    .getUseCases()
    .generateTrialSessionPaperServicePdfInteractor(applicationContext, {
      calendaredCasePdfDataArray,
    });

  return { docketEntryId, hasPaper, url };
};
