import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getJudgeWithTitle } from '../../../../../shared/src/business/utilities/getJudgeWithTitle';

export const setNoticeOfChangeOfTrialJudge = async (
  applicationContext: ServerApplicationContext,
  { caseEntity, currentTrialSession, newPdfDoc, newTrialSessionEntity },
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

  await applicationContext.getUseCaseHelpers().createAndServeNoticeDocketEntry(
    applicationContext,
    {
      caseEntity,
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
      newPdfDoc,
      noticePdf,
    },
    applicationContext.getCurrentUser(),
  );
};
