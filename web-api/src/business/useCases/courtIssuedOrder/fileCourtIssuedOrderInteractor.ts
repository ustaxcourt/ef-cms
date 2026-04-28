import {
  COURT_ISSUED_EVENT_CODES,
  DOCUMENT_RELATIONSHIPS,
  EVENT_CODES_THAT_ALLOW_FREE_TEXT,
  MOTION_ORDER_RESPONSE_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { Message } from '@shared/business/entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getMessageThreadByParentId } from '@web-api/persistence/postgres/messages/getMessageThreadByParentId';
import { orderBy, some } from 'lodash';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { upsertMessages } from '@web-api/persistence/postgres/messages/upsertMessages';
import { withTransaction } from '@web-api/persistence/postgres/utils/transactions';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const fileCourtIssuedOrder = async (
  applicationContext: ServerApplicationContext,
  {
    documentMetadata,
    primaryDocumentFileId,
  }: { documentMetadata: any; primaryDocumentFileId: string },
  authorizedUser: UnknownAuthUser,
): Promise<CaseDTO> => {
  const { docketNumber } = documentMetadata;

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await getUserById({ userId: authorizedUser.userId });

  if (!user) {
    throw new NotFoundError(`Could not find user ${authorizedUser.userId}`);
  }

  const caseToUpdate = await getCaseByDocketNumber({
    docketNumber,
    includeConsolidatedCases: false,
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

  let documentContentsId: string | undefined;
  let contentToStore:
    | { documentContents: string; richText: string | undefined }
    | undefined;

  if (documentMetadata.documentContents) {
    documentMetadata.documentContents += ` ${caseEntity.docketNumberWithSuffix} ${caseEntity.caseCaption}`;

    documentContentsId = applicationContext.getUniqueId();

    contentToStore = {
      documentContents: documentMetadata.documentContents,
      richText: documentMetadata.draftOrderState
        ? documentMetadata.draftOrderState.richText
        : undefined,
    };

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
      draftOrderState: {
        ...documentMetadata.draftOrderState,
        orderType: documentMetadata.orderType,
      },
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

  await withTransaction(async () => {
    if (documentContentsId !== undefined && contentToStore !== undefined) {
      const capturedId = documentContentsId;
      const capturedContent = contentToStore;
      await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
        contentType: 'application/json',
        document: Buffer.from(JSON.stringify(capturedContent)),
        key: capturedId,
        useTempBucket: false,
      });
    }

    await updateCaseAndAssociations({
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

      await upsertMessages([messageEntity.validate().toRawObject()]);
    }
  });

  return new CaseDTO(caseEntity.toRawObject());
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
