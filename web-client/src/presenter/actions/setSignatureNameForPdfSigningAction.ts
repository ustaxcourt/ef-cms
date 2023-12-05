import { state } from '@web-client/presenter/app.cerebral';

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
  const { ALLOWLIST_FEATURE_FLAGS, CHIEF_JUDGE } =
    applicationContext.getConstants();

  let nameForPdfSigning = '';
  let nameForSigningLine2 = '';

  if (user.section!.includes('Chambers')) {
    const judgeUser = await applicationContext
      .getUseCases()
      .getJudgeInSectionInteractor(applicationContext, {
        section: user.section,
      });
    nameForPdfSigning = judgeUser.judgeFullName!;
    nameForSigningLine2 = judgeUser.judgeTitle!;
  } else {
    const featureFlags = await applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor(applicationContext);

    nameForPdfSigning =
      featureFlags[ALLOWLIST_FEATURE_FLAGS.CHIEF_JUDGE_NAME.key];

    nameForSigningLine2 = CHIEF_JUDGE;
  }

  store.set(state.pdfForSigning.nameForSigning, nameForPdfSigning);
  store.set(state.pdfForSigning.nameForSigningLine2, nameForSigningLine2);
};
