import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../entities/EntityConstants';

export type TrialSessionInformationType = {
  chambersPhoneNumber: string;
  joinPhoneNumber: string;
  judgeName: string;
  meetingId: string;
  password: string;
  startDate: string;
  startTime: string;
  trialLocation: string;
};

/**
 * setNoticeOfChangeToRemoteProceeding
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseEntity the case data
 * @param {object} providers.newPdfDoc the new PDF contents to be appended
 * @param {object} providers.newTrialSessionEntity the new trial session data
 * @param {object} providers.userId the user ID
 */
export const setNoticeOfChangeToRemoteProceeding = async (
  applicationContext,
  { caseEntity, newPdfDoc, newTrialSessionEntity, user },
): Promise<void> => {
  const trialSessionInformation: TrialSessionInformationType = {
    chambersPhoneNumber: newTrialSessionEntity.chambersPhoneNumber,
    joinPhoneNumber: newTrialSessionEntity.joinPhoneNumber,
    judgeName: newTrialSessionEntity.judge.name,
    meetingId: newTrialSessionEntity.meetingId,
    password: newTrialSessionEntity.password,
    startDate: newTrialSessionEntity.startDate,
    startTime: newTrialSessionEntity.startTime,
    trialLocation: newTrialSessionEntity.trialLocation,
  };

  const noticePdf = await applicationContext
    .getUseCases()
    .generateNoticeOfChangeToRemoteProceedingInteractor(applicationContext, {
      docketNumber: caseEntity.docketNumber,
      trialSessionInformation,
    });

  await applicationContext
    .getUseCaseHelpers()
    .createAndServeNoticeDocketEntry(applicationContext, {
      caseEntity,
      documentInfo:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToRemoteProceeding,
      newPdfDoc,
      noticePdf,
      user,
    });
};
