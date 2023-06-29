import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../entities/EntityConstants';
import { getJudgeWithTitle } from '../../utilities/getJudgeWithTitle';

/**
 * setNoticeOfChangeOfTrialJudge
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseEntity the case data
 * @param {object} providers.currentTrialSession the old trial session data
 * @param {object} providers.newPdfDoc the new PDF contents to be appended
 * @param {object} providers.newTrialSessionEntity the new trial session data
 * @param {object} providers.userId the user ID
 */
export const setNoticeOfChangeOfTrialJudge = async (
  applicationContext,
  { caseEntity, currentTrialSession, newPdfDoc, newTrialSessionEntity, userId },
) => {
  const priorJudgeTitleWithFullName = await getJudgeWithTitle({
    applicationContext,
    judgeUserName: currentTrialSession.judge.name,
    useFullName: true,
  });

  const updatedJudgeTitleWithFullName = await getJudgeWithTitle({
    applicationContext,
    judgeUserName: newTrialSessionEntity.judge.name,
    useFullName: true,
  });

  const trialSessionInformation = {
    caseProcedureType: caseEntity.procedureType,
    chambersPhoneNumber: newTrialSessionEntity.chambersPhoneNumber,
    priorJudgeTitleWithFullName,
    proceedingType: newTrialSessionEntity.proceedingType,
    sessionScope: newTrialSessionEntity.sessionScope,
    startDate: newTrialSessionEntity.startDate,
    trialLocation: newTrialSessionEntity.trialLocation,
    updatedJudgeTitleWithFullName,
  };

  const noticePdf = await applicationContext
    .getUseCases()
    .generateNoticeOfChangeOfTrialJudgeInteractor(applicationContext, {
      docketNumber: caseEntity.docketNumber,
      trialSessionInformation,
    });

  await applicationContext
    .getUseCaseHelpers()
    .createAndServeNoticeDocketEntry(applicationContext, {
      caseEntity,
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
      newPdfDoc,
      noticePdf,
      userId,
    });
};
