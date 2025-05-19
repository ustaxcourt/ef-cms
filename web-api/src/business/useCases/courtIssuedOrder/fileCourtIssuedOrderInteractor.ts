import {
  COURT_ISSUED_EVENT_CODES,
  DOCUMENT_RELATIONSHIPS,
  EVENT_CODES_THAT_ALLOW_FREE_TEXT,
  MOTION_ORDER_RESPONSE_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { Message } from '../../../../../shared/src/business/entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
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

  const caseToUpdate = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });
  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  if (
    documentMetadata.strickenFromTrialSessions &&
    documentMetadata.jurisdiction === 'retained'
  ) {
    const ojrEventCode = COURT_ISSUED_EVENT_CODES.find(
      e => e.eventCode === 'OJR',
    );
    documentMetadata.documentType = ojrEventCode?.documentType;
    documentMetadata.eventCode = 'OJR';
  }

  if (EVENT_CODES_THAT_ALLOW_FREE_TEXT.includes(documentMetadata.eventCode)) {
    const freeText = generateFreeText(documentMetadata);
    documentMetadata.freeText = freeText;
    if (documentMetadata.draftOrderState) {
      documentMetadata.draftOrderState.freeText = freeText;
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

function generateFreeText(documentMetadata: {
  orderType: string;
  documentTitle: string;
  dueDate: string;
  eventCode: string;
  strickenFromTrialSessions: boolean;
  jurisdiction: string;
  initialFreeText: string;
}) {
  const {
    documentTitle,
    dueDate,
    eventCode,
    jurisdiction,
    orderType,
    strickenFromTrialSessions,
    initialFreeText,
  } = documentMetadata;

  const formattedDueDate = formatDateString(dueDate, FORMATS.MMDDYYYY);

  if (eventCode === 'OJR') {
    return [
      orderType === 'statusReport' &&
        `. Parties by ${formattedDueDate} shall file a status report.`,
      orderType === 'statusReportStipulatedDecision' &&
        `. Parties by ${formattedDueDate} shall file a status report or proposed stipulated decision.`,
      orderType !== 'statusReportStipulatedDecision' &&
        orderType !== 'statusReport' &&
        strickenFromTrialSessions &&
        '.',
      strickenFromTrialSessions &&
        'Case is stricken from the current trial session.',
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (eventCode === 'O') {
    if (orderType === MOTION_ORDER_RESPONSE_OPTIONS.orderType) {
      return initialFreeText;
    } else if (orderType || jurisdiction) {
      return [
        'Order',
        orderType === 'statusReport' &&
          `parties by ${formattedDueDate} shall file a status report.`,
        orderType === 'statusReportStipulatedDecision' &&
          `parties by ${formattedDueDate} shall file a status report or proposed stipulated decision.`,
        strickenFromTrialSessions &&
          'Case is stricken from the current trial session.',
        jurisdiction === 'restoredToGeneralDocket' &&
          'Case is no longer jurisdiction retained and is restored to the general docket.',
      ]
        .filter(Boolean)
        .join(' ');
    }
  }
  return documentTitle;
}
