import { Case } from '@shared/business/entities/cases/Case';
import { DOCUMENT_RELATIONSHIPS } from '@shared/business/entities/EntityConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { formatMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/formatMinuteSheet';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/getMinuteSheet';
import { getUniqueId } from '@shared/sharedAppContext';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { minuteSheet as minuteSheetDocumentGenerator } from '@shared/business/utilities/documentGenerators/minuteSheet';
import { uploadDocument } from '@web-api/persistence/s3/uploadDocument';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getTrialSessionById } from '@web-api/persistence/dynamo/trialSessions/getTrialSessionById';
import { getDownloadPolicyUrl } from '@web-api/persistence/s3/getDownloadPolicyUrl';
import { generateMinuteSheetFilename } from '@web-api/business/useCaseHelper/trialSessionMinutes/generateMinuteSheetFilename';

export const generateTrialSessionMinutesPdfInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, trialSessionId },
  authorizedUser: UnknownAuthUser,
): Promise<string> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_MINUTE_SHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }
  
  const aCase = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  const trialSession = await getTrialSessionById({
    applicationContext,
    trialSessionId,
  });

  if (!aCase || !trialSession) {
    throw new Error('Case and trial session could not be retrieved');
  }

  const minuteSheet = await getMinuteSheet({ docketNumber, trialSessionId });

  if (!minuteSheet)
    throw new NotFoundError(
      `Minute sheet for trial session ${trialSessionId} case ${docketNumber} was not found.`,
    );

  const formattedMinuteSheet = formatMinuteSheet({
    aCase,
    minuteSheet: minuteSheet.content,
    trialSession,
  });

  const pdf = await minuteSheetDocumentGenerator({
    applicationContext,
    data: {
      formattedMinuteSheet,
    },
  });

  const docketEntryId = getUniqueId();

  await uploadDocument({
    applicationContext,
    pdfData: pdf,
    pdfName: docketEntryId,
  });

  const { url } = await getDownloadPolicyUrl({
    applicationContext,
    key: docketEntryId,
    filename: generateMinuteSheetFilename({ trialSession, caseDetail: aCase }),
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

  await updateCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return url;
};
