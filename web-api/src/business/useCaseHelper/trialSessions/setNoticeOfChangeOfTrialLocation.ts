import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const setNoticeOfChangeOfTrialLocation = async (
  applicationContext: ServerApplicationContext,
  {
    caseEntity,
    newPdfDoc,
    newTrialSessionEntity,
    previousTrialSession,
  }: {
    caseEntity: Case;
    newPdfDoc: any;
    newTrialSessionEntity: TrialSession;
    previousTrialSession: RawTrialSession;
  },
  authorizedUser: AuthUser,
) => {
  const noticePdf = await applicationContext
    .getUseCases()
    .generateNoticeOfChangeOfTrialLocationInteractor(applicationContext, {
      docketNumber: caseEntity.docketNumber,
      previousTrialSession,
      updatedTrialSession: newTrialSessionEntity,
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
