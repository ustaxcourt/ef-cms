import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { state } from '@web-client/presenter/app.cerebral';

export const generateEntryOfAppearancePdfAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { GENERATION_TYPES } = applicationContext.getConstants();

  const { petitioners } = get(state.caseDetail);

  const { generationType } = get(state.form);

  if (generationType === GENERATION_TYPES.AUTO) {
    const caseDetail = get(state.caseDetail);
    const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

    const { docketNumberWithSuffix } = caseDetail;

    const { filers } = get(state.form);

    const { url } = await applicationContext
      .getUseCases()
      .generateEntryOfAppearancePdfInteractor(applicationContext, {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        filers,
        petitioners,
      });

    return { pdfUrl: url };
  }
};
