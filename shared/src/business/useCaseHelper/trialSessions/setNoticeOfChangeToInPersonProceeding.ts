import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../entities/EntityConstants';

/**
 * setNoticeOfChangeToInPersonProceeding
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseEntity the case data
 * @param {object} providers.newPdfDoc the new PDF contents to be appended
 * @param {object} providers.newTrialSessionEntity the new trial session data
 * @param {object} providers.userId the user ID
 */
export const setNoticeOfChangeToInPersonProceeding = async (
  applicationContext,
  { caseEntity, newPdfDoc, newTrialSessionEntity, user },
) => {
  const trialSessionInformation = {
    address1: newTrialSessionEntity.address1,
    address2: newTrialSessionEntity.address2,
    chambersPhoneNumber: newTrialSessionEntity.chambersPhoneNumber,
    city: newTrialSessionEntity.city,
    courthouseName: newTrialSessionEntity.courthouseName,
    judgeName: newTrialSessionEntity.judge.name,
    startDate: newTrialSessionEntity.startDate,
    startTime: newTrialSessionEntity.startTime,
    state: newTrialSessionEntity.state,
    trialLocation: newTrialSessionEntity.trialLocation,
    zip: newTrialSessionEntity.postalCode,
  };

  const noticePdf = await applicationContext
    .getUseCaseHelpers()
    .generateNoticeOfChangeToInPersonProceeding(applicationContext, {
      docketNumber: caseEntity.docketNumber,
      trialSessionInformation,
    });

  const additionalDocketEntryInfo = {
    date: newTrialSessionEntity.startDate,
    signedAt: applicationContext.getUtilities().createISODateString(),
    trialLocation: newTrialSessionEntity.trialLocation,
  };

  await applicationContext
    .getUseCaseHelpers()
    .createAndServeNoticeDocketEntry(applicationContext, {
      additionalDocketEntryInfo,
      caseEntity,
      documentInfo:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToInPersonProceeding,
      newPdfDoc,
      noticePdf,
      user,
    });
};
