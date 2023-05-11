import { state } from 'cerebral';

/**
 * sets the name to be used for signing a pdf
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext object
 * @param {object} providers.store the cerebral store object used for setting pdfForSigning.nameForSigning
 */
export const setSignatureNameForPdfSigningAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
  const user = applicationContext.getCurrentUser();
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  let nameForPdfSigning;
  let nameForSigningLine2;

  if (user.section.includes('Chambers')) {
    const judgeUser = await applicationContext
      .getUseCases()
      .getJudgeInSectionInteractor(applicationContext, {
        section: user.section,
      });
    nameForPdfSigning = judgeUser.judgeFullName;
    nameForSigningLine2 = judgeUser.judgeTitle;
  } else {
    nameForPdfSigning = await applicationContext
      .getUseCases()
      .getChiefJudgeNameForSigningInteractor(applicationContext);
    nameForSigningLine2 = CHIEF_JUDGE;
  }
  store.set(state.pdfForSigning.nameForSigning, nameForPdfSigning);
  store.set(state.pdfForSigning.nameForSigningLine2, nameForSigningLine2);
};
