import { Case } from '@shared/business/entities/cases/Case';
import { DOCUMENT_RELATIONSHIPS } from '@shared/business/entities/EntityConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUniqueId } from '@shared/sharedAppContext';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { createAndUploadMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/createAndUploadMinuteSheet';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { CaseDTO } from '@shared/business/dto/docketEntries/CaseDTO';

export const saveMinuteSheetToDraftsInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, trialSessionId },
  authorizedUser: UnknownAuthUser,
): Promise<CaseDTO> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_MINUTE_SHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const aCase = await getCaseByDocketNumber({
    docketNumber,
  });

  const trialSession = await getTrialSessionById({
    trialSessionId,
  });

  if (!aCase || !trialSession) {
    throw new Error('Case and trial session could not be retrieved');
  }

  const docketEntryId = getUniqueId();

  const pdf = await createAndUploadMinuteSheet(applicationContext, {
    docketNumber,
    trialSessionId,
    aCase,
    trialSession,
    docketEntryId,
  });

  const documentTitle = `Minutes`;

  const documentMetadata = {
    docketNumber,
    documentTitle,
    primaryDocumentFileSize: pdf.byteLength,
  };

  const draftDocketEntry = new DocketEntry(
    {
      ...documentMetadata,
      docketEntryId,
      filedBy: authorizedUser.name,
      isDraft: true,
      isFileAttached: true,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
    },
    { authorizedUser },
  );
  draftDocketEntry.setFiledBy(authorizedUser);

  draftDocketEntry.setAsProcessingStatusAsCompleted();

  const caseEntity = new Case(aCase, { authorizedUser });
  caseEntity.addDocketEntry(draftDocketEntry);

  const theCase = await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return new CaseDTO(theCase);
};
