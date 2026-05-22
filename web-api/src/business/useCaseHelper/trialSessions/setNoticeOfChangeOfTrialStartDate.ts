import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { PDFDocument } from 'pdf-lib';

export const setNoticeOfChangeOfTrialStartDate = async (
  applicationContext: ServerApplicationContext,
  {
    caseEntity,
    newPdfDoc,
    newTrialSessionEntity,
    previousTrialSession,
  }: {
    caseEntity: Case;
    newPdfDoc: PDFDocument;
    newTrialSessionEntity: TrialSession;
    previousTrialSession: RawTrialSession;
  },
  authorizedUser: AuthUser,
): Promise<() => void> => {
  const noticePdf = await applicationContext
    .getUseCases()
    .generateNoticeOfChangeOfTrialStartDateInteractor(applicationContext, {
      docketNumber: caseEntity.docketNumber,
      previousTrialSession,
      updatedTrialSession: newTrialSessionEntity,
    });

  return applicationContext.getUseCaseHelpers().createAndServeNoticeDocketEntry(
    applicationContext,
    {
      caseEntity,
      documentInfo:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialStartDate,
      newPdfDoc,
      noticePdf,
    },
    authorizedUser,
  );
};
