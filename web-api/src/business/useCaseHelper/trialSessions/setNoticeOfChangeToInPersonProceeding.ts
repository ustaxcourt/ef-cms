import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const setNoticeOfChangeToInPersonProceeding = async (
  applicationContext: ServerApplicationContext,
  {
    caseEntity,
    newPdfDoc,
    newTrialSessionEntity,
  }: { caseEntity: Case; newPdfDoc: any; newTrialSessionEntity: any },
  authorizedUser: AuthUser,
): Promise<void> => {
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

  await applicationContext.getUseCaseHelpers().createAndServeNoticeDocketEntry(
    applicationContext,
    {
      additionalDocketEntryInfo,
      caseEntity,
      documentInfo:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToInPersonProceeding,
      newPdfDoc,
      noticePdf,
    },
    authorizedUser,
  );
};
