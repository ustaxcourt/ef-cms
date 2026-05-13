import {
  COURT_ISSUED_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { Message } from '@shared/business/entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { Stamp } from '@web-api/business/entities/Stamp';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getMessageThreadByParentId } from '@web-api/persistence/postgres/messages/getMessageThreadByParentId';
import { orderBy } from 'lodash';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { upsertMessages } from '@web-api/persistence/postgres/messages/upsertMessages';
import { setDocumentTitle } from '@web-api/business/utilities/setDocumentTitle';
import { getUniqueId } from '@shared/sharedAppContext';

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
  }: {
    docketNumber: string;
    formattedDraftDocumentTitle: string;
    originalDocketEntryId: string;
    parentMessageId?: string;
    stampData: {
      disposition: string;
      nameForSigning: string;
    };
  },
  authorizedUser: UnknownAuthUser,
): Promise<DocketEntry> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.STAMP_MOTION)) {
    throw new UnauthorizedError('Unauthorized to update docket entry');
  }

  const caseRecord = await getCaseByDocketNumber({
    docketNumber,
  });
  const caseEntity = new Case(caseRecord, { authorizedUser });
  const originalDocketEntry = caseEntity.docketEntries.find(
    docketEntry => docketEntry.docketEntryId === originalDocketEntryId,
  );

  if (!originalDocketEntry) {
    throw new NotFoundError(
      `Could not find docket entry with id ${originalDocketEntryId} on case ${docketNumber}`,
    );
  }

  const orderDocumentInfo = COURT_ISSUED_EVENT_CODES.find(
    doc => doc.eventCode === 'O',
  );

  const validatedStampData = new Stamp(stampData);

  const stampedDocketEntryId = getUniqueId();

  const stampedDocketEntryEntity = new DocketEntry(
    {
      createdAt: applicationContext.getUtilities().createISODateString(),
      docketEntryId: stampedDocketEntryId,
      documentStorageId: stampedDocketEntryId,
      docketNumber: caseRecord.docketNumber,
      documentTitle: `${setDocumentTitle(originalDocketEntry.documentTypeForStampedDocketEntry(), validatedStampData)} - ${formattedDraftDocumentTitle}`,
      documentType: orderDocumentInfo?.documentType,
      draftOrderState: {
        docketNumber: caseEntity.docketNumber,
        documentTitle: `${formattedDraftDocumentTitle}`,
        documentType: orderDocumentInfo?.documentType,
        eventCode: orderDocumentInfo?.eventCode,
        freeText: `${setDocumentTitle(originalDocketEntry.documentTypeForStampedDocketEntry(), validatedStampData)} - ${formattedDraftDocumentTitle}`,
      },
      eventCode: orderDocumentInfo?.eventCode,
      filedBy: authorizedUser.name,
      freeText: `${setDocumentTitle(originalDocketEntry.documentTypeForStampedDocketEntry(), validatedStampData)} - ${formattedDraftDocumentTitle}`,
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
      documentTitle: `${setDocumentTitle(stampedDocketEntryEntity.documentTitle, validatedStampData)}`,
    });

    await upsertMessages([messageEntity.validate().toRawObject()]);
  }

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return stampedDocketEntryEntity;
};

export const addDraftStampOrderDocketEntryInteractor = withLocking(
  addDraftStampOrderDocketEntry,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
