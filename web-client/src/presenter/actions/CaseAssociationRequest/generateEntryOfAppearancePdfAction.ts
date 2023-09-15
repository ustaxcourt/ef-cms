import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { state } from '@web-client/presenter/app.cerebral';

export const generateEntryOfAppearancePdfAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { GENERATION_TYPES } = get(state.constants);

  if (get(state.form.generationType) === GENERATION_TYPES.AUTO) {
    const caseDetail = get(state.caseDetail);
    const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

    const { docketNumber, docketNumberWithSuffix, petitioners } = caseDetail;

    const { filers } = get(state.form);

    const pdfUrl = await applicationContext
      .getUseCases()
      .generateEntryOfAppearancePdfInteractor(applicationContext, {
        caseCaptionExtension,
        caseTitle,
        docketNumber,
        docketNumberWithSuffix,
        filers,
        petitioners,
      });

    return { pdfUrl };
  }
};
