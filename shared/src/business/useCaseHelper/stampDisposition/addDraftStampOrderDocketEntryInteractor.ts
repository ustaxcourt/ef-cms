import {
  COURT_ISSUED_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} from '../../entities/EntityConstants';
import { Case } from '../../entities/cases/Case';
import { DocketEntry } from '../../entities/DocketEntry';
import { Message } from '../../entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { Stamp } from '../../entities/Stamp';
import { UnauthorizedError } from '@web-api/errors/errors';
import { orderBy } from 'lodash';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

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
  applicationContext,
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
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.STAMP_MOTION)) {
    throw new UnauthorizedError('Unauthorized to update docket entry');
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  const caseEntity = new Case(caseRecord, { applicationContext });
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
      filedBy: user.judgeFullName || user.name,
      freeText: `${originalDocketEntryEntity.documentType} ${formattedDraftDocumentTitle}`,
      isDraft: true,
      isPaper: false,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      stampData: validatedStampData,
    },
    { applicationContext },
  );

  stampedDocketEntryEntity.setFiledBy(user);

  stampedDocketEntryEntity.setSigned(user.userId, stampData.nameForSigning);

  caseEntity.addDocketEntry(stampedDocketEntryEntity);

  if (parentMessageId) {
    const messages = await applicationContext
      .getPersistenceGateway()
      .getMessageThreadByParentId({
        applicationContext,
        parentMessageId,
      });

    const mostRecentMessage = orderBy(messages, 'createdAt', 'desc')[0];

    const messageEntity = new Message(mostRecentMessage, {
      applicationContext,
    }).validate();
    messageEntity.addAttachment({
      documentId: stampedDocketEntryEntity.docketEntryId,
      documentTitle: stampedDocketEntryEntity.documentTitle,
    });

    await applicationContext.getPersistenceGateway().updateMessage({
      applicationContext,
      message: messageEntity.validate().toRawObject(),
    });
  }

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });
};

export const addDraftStampOrderDocketEntryInteractor = withLocking(
  addDraftStampOrderDocketEntry,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
