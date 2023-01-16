/**
 * fix
 */
export const createPaperServicePdfForCasesAction = async ({
  applicationContext,
  props,
}) => {
  let { calendaredCasePdfDataArray } = props;

  console.log(calendaredCasePdfDataArray, './............');

  let docketEntryId = '';
  let hasPaper;
  let url = '';
  try {
    console.log('gonna try');

    ({ docketEntryId, hasPaper, url } = await applicationContext
      .getUseCases()
      .generateTrialSessionPaperServicePdfInteractor(applicationContext, {
        calendaredCasePdfDataArray,
      }));
  } catch (e) {
    console.log('fuuuuuu', e);
  }

  return { docketEntryId, hasPaper, url };
};
//call a diff interactor seeihng if it works
//if YES, call that new interactor with our pdf data array and see if that works
