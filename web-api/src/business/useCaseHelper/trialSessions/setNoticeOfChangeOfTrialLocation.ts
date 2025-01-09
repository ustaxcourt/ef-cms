import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const setNoticeOfChangeOfTrialLocation = async (
  applicationContext: ServerApplicationContext,
  { caseEntity, currentTrialSession, newPdfDoc, newTrialSessionEntity },
  authorizedUser: AuthUser,
) => {
  const noticePdf = await applicationContext
    .getUseCases()
    .generateNoticeOfChangeOfTrialLocationInteractor(applicationContext, {
      currentTrialSession,
      docketNumber: caseEntity.docketNumber,
      trialSession: newTrialSessionEntity,
    });

  await applicationContext.getUseCaseHelpers().createAndServeNoticeDocketEntry(
    applicationContext,
    {
      caseEntity,
      documentInfo:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialLocation,
      newPdfDoc,
      noticePdf,
    },
    authorizedUser,
  );
};
