import { type AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { type ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { Case } from '@shared/business/entities/cases/Case';
import { UnauthorizedError } from '@web-api/errors/errors';

export const scrapeDocumentContentsWorker = async (
  applicationContext: ServerApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
  authorizedUser: AuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EDIT_ORDER)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseRecord = await getCaseByDocketNumber({
    docketNumber,
  });
  applicationContext.logger.info(
    `scrapeDocumentContentsWorker: Retrieved ${docketNumber} case record`,
    { docketNumber },
  );
  const caseEntity = new Case(caseRecord, {
    authorizedUser,
  });
  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });
  if (!docketEntryEntity) {
    const errorMessage = `scrapeDocumentContentsWorker: Docket entry ${docketEntryId} not found`;
    applicationContext.logger.error(errorMessage);
    throw new Error(errorMessage);
  }
  applicationContext.logger.info(
    `scrapeDocumentContentsWorker: Found docket entry ${docketEntryId}`,
    { existingDocumentContentsId: docketEntryEntity.documentContentsId },
  );

  const docketEntryPdfData = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      key: docketEntryId,
      useTempBucket: false,
    });
  applicationContext.logger.info(
    `scrapeDocumentContentsWorker: Retrieved PDF blob for ${docketEntryId}`,
    { size: docketEntryPdfData.length },
  );
  let documentContents: string = await applicationContext
    .getUseCaseHelpers()
    .parseAndScrapePdfContents({
      applicationContext,
      pdfBuffer: docketEntryPdfData,
    });
  if (caseRecord.docketNumberWithSuffix && caseRecord.caseCaption) {
    documentContents = `${documentContents} ${caseRecord.docketNumberWithSuffix} ${caseRecord.caseCaption}`;
  }
  const documentContentsId = applicationContext.getUniqueId();
  const contentToStore = { documentContents };
  applicationContext.logger.info(
    `scrapeDocumentContentsWorker: Parsed text contents from PDF blob for ${docketEntryId}`,
    { size: JSON.stringify(contentToStore).length },
  );
  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    contentType: 'application/json',
    document: Buffer.from(JSON.stringify(contentToStore)),
    key: documentContentsId,
    useTempBucket: false,
  });
  applicationContext.logger.info(
    `scrapeDocumentContentsWorker: Stored text contents as ${documentContentsId}`,
    { documentContentsId },
  );

  docketEntryEntity.documentContentsId = documentContentsId;
  const validatedDocketEntry = docketEntryEntity.validate().toRawObject();
  await upsertDocketEntries([validatedDocketEntry]);
  applicationContext.logger.info(
    `scrapeDocumentContentsWorker: Updated docket entry ${docketEntryId}`,
    { documentContentsId: validatedDocketEntry.documentContentsId },
  );
};
