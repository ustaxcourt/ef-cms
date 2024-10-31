import {
  COURT_ISSUED_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import { Message } from '../../../../../shared/src/business/entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { Stamp } from '../../../../../shared/src/business/entities/Stamp';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getMessageThreadByParentId } from '@web-api/persistence/postgres/messages/getMessageThreadByParentId';
import { orderBy } from 'lodash';
import { updateMessage } from '@web-api/persistence/postgres/messages/updateMessage';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

/**
 * addDraftStampOrderDocketEntryInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case on which to save the document
 * @param {string} providers.formattedDraftDocumentTitle the formatted draft document title of the document
 * @param {string} providers.originalDocketEntryId the id of the original (un-stamped) document
 * @param {string} providers.parentMessageId the id of the parent message to add the stamped document to
 * @param {string} providers.stampedDocketEntryId the id of the stamped document
 * @param {string} providers.stampData the stampData from the form
 */
export const addDraftStampOrderDocketEntry = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    formattedDraftDocumentTitle,
    originalDocketEntryId,
    parentMessageId,
    stampData,
    stampedDocketEntryId,
  }: {
    docketNumber: string;
    formattedDraftDocumentTitle: string;
    originalDocketEntryId: string;
    parentMessageId?: string;
    stampData: {
      disposition: string;
      nameForSigning: string;
    };
    stampedDocketEntryId: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.STAMP_MOTION)) {
    throw new UnauthorizedError('Unauthorized to update docket entry');
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  const caseEntity = new Case(caseRecord, { authorizedUser });
  const originalDocketEntryEntity = caseEntity.docketEntries.find(
    docketEntry => docketEntry.docketEntryId === originalDocketEntryId,
  );

  let stampedDocketEntryEntity;
  const orderDocumentInfo = COURT_ISSUED_EVENT_CODES.find(
    doc => doc.eventCode === 'O',
  );

  const validatedStampData = new Stamp(stampData);

  stampedDocketEntryEntity = new DocketEntry(
    {
      createdAt: applicationContext.getUtilities().createISODateString(),
      docketEntryId: stampedDocketEntryId,
      docketNumber: caseRecord.docketNumber,
      documentTitle: `${originalDocketEntryEntity.documentType} ${formattedDraftDocumentTitle}`,
      documentType: orderDocumentInfo?.documentType,
      draftOrderState: {
        docketNumber: caseEntity.docketNumber,
        documentTitle: formattedDraftDocumentTitle,
        documentType: orderDocumentInfo?.documentType,
        eventCode: orderDocumentInfo?.eventCode,
        freeText: `${originalDocketEntryEntity.documentType} ${formattedDraftDocumentTitle}`,
      },
      eventCode: orderDocumentInfo?.eventCode,
      filedBy: authorizedUser.name,
      freeText: `${originalDocketEntryEntity.documentType} ${formattedDraftDocumentTitle}`,
      isDraft: true,
      isFileAttached: true,
      isPaper: false,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      stampData: validatedStampData,
    },
    { authorizedUser },
  );

  stampedDocketEntryEntity.setFiledBy(authorizedUser);

  stampedDocketEntryEntity.setSigned(
    authorizedUser.userId,
    stampData.nameForSigning,
  );

  caseEntity.addDocketEntry(stampedDocketEntryEntity);

  if (parentMessageId) {
    const messages = await getMessageThreadByParentId({
      parentMessageId,
    });

    const mostRecentMessage = orderBy(messages, 'createdAt', 'desc')[0];

    const messageEntity = new Message(mostRecentMessage).validate();
    messageEntity.addAttachment({
      documentId: stampedDocketEntryEntity.docketEntryId,
      documentTitle: stampedDocketEntryEntity.documentTitle,
    });

    await updateMessage({
      message: messageEntity.validate().toRawObject(),
    });
  }

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToUpdate: caseEntity,
  });
};

export const addDraftStampOrderDocketEntryInteractor = withLocking(
  addDraftStampOrderDocketEntry,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
