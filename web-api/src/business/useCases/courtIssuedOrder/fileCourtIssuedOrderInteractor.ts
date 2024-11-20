import {
  COURT_ISSUED_EVENT_CODES,
  DOCUMENT_RELATIONSHIPS,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import { Message } from '../../../../../shared/src/business/entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getMessageThreadByParentId } from '@web-api/persistence/postgres/messages/getMessageThreadByParentId';
import { orderBy, some } from 'lodash';
import { updateMessage } from '@web-api/persistence/postgres/messages/updateMessage';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

export const fileCourtIssuedOrder = async (
  applicationContext: ServerApplicationContext,
  {
    documentMetadata,
    primaryDocumentFileId,
  }: { documentMetadata: any; primaryDocumentFileId: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawCase> => {
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
  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  console.log('********documentMetadata', documentMetadata);
  console.log('********documentMetadata', documentMetadata);
  console.log('********user', user);

  if (['O', 'NOT'].includes(documentMetadata.eventCode)) {
    const freeText = generateFreeText(documentMetadata);
    documentMetadata.freeText = freeText;
    if (documentMetadata.draftOrderState) {
      documentMetadata.draftOrderState.freeText = freeText;
    }
  }

  if (isDocumentTypeOJR(documentMetadata)) {
    const ojrEventCode = COURT_ISSUED_EVENT_CODES.find(
      e => e.eventCode === 'OJR',
    );
    documentMetadata.documentType = ojrEventCode?.documentType;
    documentMetadata.eventCode = 'OJR';
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
    { authorizedUser },
  );

  docketEntryEntity.setFiledBy(user);

  docketEntryEntity.setAsProcessingStatusAsCompleted();

  caseEntity.addDocketEntry(docketEntryEntity);

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  if (documentMetadata.parentMessageId) {
    const messages = await getMessageThreadByParentId({
      parentMessageId: documentMetadata.parentMessageId,
    });

    const mostRecentMessage = orderBy(messages, 'createdAt', 'desc')[0];

    const messageEntity = new Message(mostRecentMessage).validate();

    const isAttached = some(
      messageEntity.attachments,
      attachment => attachment.documentId === docketEntryEntity.docketEntryId,
    );

    if (!isAttached) {
      messageEntity.addAttachment({
        documentId: docketEntryEntity.docketEntryId,
        documentTitle: docketEntryEntity.documentTitle,
      });
    }

    await updateMessage({
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

function generateFreeText(documentMetaData: {
  orderType: string;
  documentTitle: string;
  dueDate: string;
  strickenFromTrialSessions: boolean;
  jurisdiction: string;
}) {
  if (
    documentMetaData.orderType === 'statusReport' &&
    documentMetaData.strickenFromTrialSessions &&
    documentMetaData.jurisdiction === 'restoredToGeneralDocket'
  ) {
    return `Order parties by ${documentMetaData.dueDate} shall file a status report. Case is stricken from the current trial session. Case is no longer jurisdiction retained and is restored to the general docket.`;
  }

  if (isDocumentTypeOJR(documentMetaData)) {
    return 'Order that jurisdiction is retained by Judge [JUDGE NAME]. Parties by [DATE INPUT] shall file a status report. Case is stricken from the current trial session.';
  }

  if (documentMetaData.orderType === 'statusReport') {
    return `Parties by ${documentMetaData.dueDate} shall file a status report.`;
  }
  if (documentMetaData.orderType === 'statusReportStipulatedDecision') {
    return `Parties by ${documentMetaData.dueDate} shall file a status report or proposed stipulated decision.`;
  }

  return documentMetaData.documentTitle; // do we want to default here?
}

function isDocumentTypeOJR(documentMetaData: {
  orderType: string;
  documentTitle: string;
  dueDate: string;
  strickenFromTrialSessions: boolean;
  jurisdiction: string;
}) {
  return (
    documentMetaData.strickenFromTrialSessions &&
    documentMetaData.jurisdiction === 'retained'
  );
}
