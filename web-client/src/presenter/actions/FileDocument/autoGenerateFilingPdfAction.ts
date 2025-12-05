import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { state } from '@web-client/presenter/app.cerebral';

export const autoGenerateFilingPdfAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { GENERATION_TYPES } = applicationContext.getConstants();

  const { petitioners } = get(state.caseDetail);

  const { generationType, eventCode } = get(state.form);

  if (generationType === GENERATION_TYPES.AUTO) {
    const caseDetail = get(state.caseDetail);
    const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

    const { docketNumber, docketNumberWithSuffix } = caseDetail;

    const { filers } = get(state.form);

    let response;
    switch (eventCode) {
      case 'EA':
        response = await applicationContext
          .getUseCases()
          .generateEntryOfAppearancePdfInteractor(applicationContext, {
            caseCaptionExtension,
            caseTitle,
            docketNumberWithSuffix,
            filers,
            petitioners,
          });
        break;
      case 'NOTW':
        response = await applicationContext
          .getUseCases()
          .generateNoticeOfWithdrawalPdfInteractor(applicationContext, {
            caseCaptionExtension,
            caseTitle,
            docketNumber,
            docketNumberWithSuffix,
            filers,
            petitioners,
          });
        break;
    }

    return { pdfUrl: response.url };
  }
};
