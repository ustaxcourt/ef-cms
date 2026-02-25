import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { state } from '@web-client/presenter/app.cerebral';

export const autoGenerateFilingPdfAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { GENERATION_TYPES } = applicationContext.getConstants();

  const caseDetail = get(state.caseDetail);

  const { petitioners, docketNumber, docketNumberWithSuffix } = caseDetail;

  const { generationType, eventCode, filers, partiesToWithdrawFrom } = get(
    state.form,
  );

  const user = get(state.user);

  if (
    generationType === GENERATION_TYPES.AUTO &&
    (user.role === ROLES.privatePractitioner ||
      user.role === ROLES.irsPractitioner)
  ) {
    const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);
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
            partiesToWithdrawFrom,
            petitioners,
          });
        if (
          petitioners.some(
            p => p.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
          )
        ) {
          store.set(state.form.certificateOfService, true);
          store.set(state.form.certificateOfServiceDate, createISODateString());
        }
        break;
    }

    return { pdfUrl: response.url };
  }
};
