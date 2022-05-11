const {
  CASE_STATUS_TYPES,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');

/**
 * setNoticeOfChangeToRemoteProceeding
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseEntity the case data
 * @param {object} providers.currentTrialSession the old trial session data
 * @param {object} providers.newPdfDoc the new PDF contents to be appended
 * @param {object} providers.newTrialSessionEntity the new trial session data
 * @param {object} providers.userId the user ID
 */
exports.setNoticeOfChangeToRemoteProceeding = async (
  applicationContext,
  { caseEntity, currentTrialSession, newPdfDoc, newTrialSessionEntity, userId },
) => {
  const shouldIssueNoticeOfChangeToRemoteProceeding =
    currentTrialSession.proceedingType ===
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson &&
    newTrialSessionEntity.proceedingType ===
      TRIAL_SESSION_PROCEEDING_TYPES.remote &&
    caseEntity.status !== CASE_STATUS_TYPES.closed;

  if (shouldIssueNoticeOfChangeToRemoteProceeding) {
    const trialSessionInformation = {
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
        userId,
      });
  }
};
