import { Case } from '../../entities/cases/Case';
import { DOCUMENT_RELATIONSHIPS } from '../../entities/EntityConstants';
import { DocketEntry } from '../../entities/DocketEntry';
import { Message } from '../../entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { orderBy } from 'lodash';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the primary document
 * @returns {Promise<*>} the updated case entity after the document is added
 */
export const fileCourtIssuedOrder = async (
  applicationContext: IApplicationContext,
  {
    documentMetadata,
    primaryDocumentFileId,
  }: { documentMetadata: any; primaryDocumentFileId: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();
  const { docketNumber } = documentMetadata;

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const shouldScrapePDFContents = !documentMetadata.documentContents;

  if (['O', 'NOT'].includes(documentMetadata.eventCode)) {
    documentMetadata.freeText = documentMetadata.documentTitle;
    if (documentMetadata.draftOrderState) {
      documentMetadata.draftOrderState.freeText =
        documentMetadata.documentTitle;
    }
  }

  if (shouldScrapePDFContents) {
    const { Body: pdfBuffer } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: primaryDocumentFileId,
      })
      .promise();

    const contents = await applicationContext
      .getUseCaseHelpers()
      .parseAndScrapePdfContents({ applicationContext, pdfBuffer });

    if (contents) {
      documentMetadata.documentContents = contents;
    }
  }

  if (documentMetadata.documentContents) {
    documentMetadata.documentContents += ` ${caseEntity.docketNumberWithSuffix} ${caseEntity.caseCaption}`;

    const documentContentsId = applicationContext.getUniqueId();

    const contentToStore = {
      documentContents: documentMetadata.documentContents,
      richText: documentMetadata.draftOrderState
        ? documentMetadata.draftOrderState.richText
        : undefined,
    };

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      contentType: 'application/json',
      document: Buffer.from(JSON.stringify(contentToStore)),
      key: documentContentsId,
      useTempBucket: false,
    });

    if (documentMetadata.draftOrderState) {
      delete documentMetadata.draftOrderState.documentContents;
      delete documentMetadata.draftOrderState.richText;
      delete documentMetadata.draftOrderState.editorDelta;
    }

    delete documentMetadata.documentContents;
    documentMetadata.documentContentsId = documentContentsId;
  }

  const docketEntryEntity = new DocketEntry(
    {
      ...documentMetadata,
      docketEntryId: primaryDocumentFileId,
      documentType: documentMetadata.documentType,
      filedBy: user.name,
      isDraft: true,
      isFileAttached: true,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
    },
    { applicationContext },
  );

  docketEntryEntity.setFiledBy(user);

  docketEntryEntity.setAsProcessingStatusAsCompleted();

  caseEntity.addDocketEntry(docketEntryEntity);

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });

  if (documentMetadata.parentMessageId) {
    const messages = await applicationContext
      .getPersistenceGateway()
      .getMessageThreadByParentId({
        applicationContext,
        parentMessageId: documentMetadata.parentMessageId,
      });

    const mostRecentMessage = orderBy(messages, 'createdAt', 'desc')[0];

    const messageEntity = new Message(mostRecentMessage, {
      applicationContext,
    }).validate();
    messageEntity.addAttachment({
      documentId: docketEntryEntity.docketEntryId,
      documentTitle: docketEntryEntity.documentTitle,
    });

    await applicationContext.getPersistenceGateway().upsertMessage({
      applicationContext,
      message: messageEntity.validate().toRawObject(),
    });
  }

  return caseEntity.toRawObject();
};

export const fileCourtIssuedOrderInteractor = withLocking(
  fileCourtIssuedOrder,
  (_applicationContext: IApplicationContext, { documentMetadata }) => ({
    identifiers: [`case|${documentMetadata.docketNumber}`],
  }),
);
