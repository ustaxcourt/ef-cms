import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { DOCUMENT_RELATIONSHIPS } from '../../../../../shared/src/business/entities/EntityConstants';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import { Message } from '../../../../../shared/src/business/entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { orderBy } from 'lodash';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

export const fileCourtIssuedOrder = async (
  applicationContext: ServerApplicationContext,
  {
    documentMetadata,
    primaryDocumentFileId,
  }: { documentMetadata: any; primaryDocumentFileId: string },
): Promise<RawCase> => {
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
    const pdfBuffer = await applicationContext
      .getPersistenceGateway()
      .getDocument({ applicationContext, key: primaryDocumentFileId });

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

    await applicationContext.getPersistenceGateway().updateMessage({
      applicationContext,
      message: messageEntity.validate().toRawObject(),
    });
  }

  return caseEntity.toRawObject();
};

export const fileCourtIssuedOrderInteractor = withLocking(
  fileCourtIssuedOrder,
  (_applicationContext: ServerApplicationContext, { documentMetadata }) => ({
    identifiers: [`case|${documentMetadata.docketNumber}`],
  }),
);
