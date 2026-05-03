import { Case } from '@shared/business/entities/cases/Case';
import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '@shared/business/entities/EntityConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { copyPagesAndAppendToTargetPdf } from '@shared/business/utilities/copyPagesAndAppendToTargetPdf';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { shouldAppendClinicLetter } from '@shared/business/utilities/shouldAppendClinicLetter';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { updateTrialSessionNotificationProcessing } from '@web-api/persistence/postgres/trialSessions/updateTrialSessionNotificationProcessing';
import { getTrialSessionNotificationProcessing } from '@web-api/persistence/postgres/trialSessions/getTrialSessionNotificationProcessing';
import { NotFoundError } from '@web-api/errors/errors';
import { countPagesInDocument } from '@web-api/business/useCaseHelper/countPagesInDocument';

/**
 * serves a notice of trial session and standing pretrial document on electronic
 * recipients and generates paper notices for those that get paper service
 * @param {object} deconstructed.applicationContext the applicationContext
 * @param {object} deconstructed.appendClinicLetter true if the clinic letter has been appended to the notice
 * @param {object} deconstructed.caseEntity the case entity
 * @param {object} deconstructed.newPdfDoc the pdf we are generating
 * @param {Uint8Array} deconstructed.noticeDocketEntryEntity the docket entry entity
 * @param {object} deconstructed.noticeDocumentPdfData the pdf data for the notice
 * @param {object} deconstructed.PDFDocument pdf-lib object
 * @param {object} deconstructed.servedParties the parties this document will be served to
 * @param {object} deconstructed.standingPretrialDocketEntryEntity the entity for the standing pretrial docket entry
 * @param {Uint8Array} deconstructed.standingPretrialPdfData the pdf data for the standing pretrial
 */
const serveNoticesForCase = async ({
  appendClinicLetter,
  applicationContext,
  caseEntity,
  newPdfDoc,
  noticeDocketEntryEntity,
  noticeOfTrialIssued,
  noticeOfTrialIssuedWithClinicLetter,
  PDFDocument,
  servedParties,
  standingPretrialDocketEntryEntity,
  standingPretrialFile,
}) => {
  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId: noticeDocketEntryEntity.docketEntryId,
    servedParties,
  });

  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId: standingPretrialDocketEntryEntity.docketEntryId,
    servedParties,
  });

  const standingPretrialPdf = await PDFDocument.load(standingPretrialFile);
  const combinedDocumentsPdf = await PDFDocument.create();

  if (servedParties.paper.length > 0) {
    for (const party of servedParties.paper) {
      // practitioners do not have a contactId
      let noticeDocumentPdf;
      const userId = party.userId || party.contactId;
      if (
        !caseEntity.isPractitioner(userId) &&
        !Case.isPetitionerRepresented(caseEntity, party.contactId) &&
        appendClinicLetter
      ) {
        noticeDocumentPdf = await PDFDocument.load(
          noticeOfTrialIssuedWithClinicLetter,
        );
      } else {
        noticeDocumentPdf = await PDFDocument.load(noticeOfTrialIssued);
      }

      const addressPage = await applicationContext
        .getDocumentGenerators()
        .addressLabelCoverSheet({
          applicationContext,
          data: {
            ...party,
            docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
          },
        });

      const addressPageDoc = await PDFDocument.load(addressPage);

      await copyPagesAndAppendToTargetPdf({
        copyFrom: addressPageDoc,
        copyInto: combinedDocumentsPdf,
      });

      await copyPagesAndAppendToTargetPdf({
        copyFrom: noticeDocumentPdf,
        copyInto: combinedDocumentsPdf,
      });

      await copyPagesAndAppendToTargetPdf({
        copyFrom: standingPretrialPdf,
        copyInto: combinedDocumentsPdf,
      });
    }

    await copyPagesAndAppendToTargetPdf({
      copyFrom: combinedDocumentsPdf,
      copyInto: newPdfDoc,
    });
  }
};

/**
 * generates a notice of trial session and adds to the case
 * @param {object} deconstructed.applicationContext the applicationContext
 * @param {object} deconstructed.caseRecord true if the clinic letter has been appended to the notice
 * @param {string} deconstructed.docketNumber the case entity
 * @param {string} deconstructed.jobId the pdf we are generating
 * @param {object} deconstructed.trialSession the pdf data for the notice
 * @param {object} deconstructed.trialSessionEntity pdf-lib object
 * @param {object} deconstructed.user the person that initiated generation of notices
 */
const setNoticeForCase = async ({
  applicationContext,
  caseRecord,
  docketNumber,
  jobId,
  trialSession,
  trialSessionEntity,
  user,
}: {
  applicationContext: ServerApplicationContext;
  caseRecord: any;
  docketNumber: any;
  jobId: any;
  trialSession: any;
  trialSessionEntity: any;
  user: any;
}) => {
  const caseEntity = new Case(caseRecord, { authorizedUser: undefined });
  const { procedureType } = caseRecord;

  const noticeOfTrialIssued = await applicationContext
    .getUseCases()
    .generateNoticeOfTrialIssuedInteractor(applicationContext, {
      docketNumber: caseEntity.docketNumber,
      trialSessionId: trialSessionEntity.trialSessionId,
    });

  const servedParties = aggregatePartiesForService(caseEntity);

  const { appendClinicLetter, clinicLetterKey } =
    await shouldAppendClinicLetter({
      applicationContext,
      caseEntity,
      procedureType,
      trialSession,
    });

  let clinicLetter;
  let noticeOfTrialIssuedWithClinicLetter;
  const newNoticeOfTrialIssuedDocumentStorageId =
    applicationContext.getUniqueId();
  if (appendClinicLetter) {
    clinicLetter = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: clinicLetterKey,
        useTempBucket: false,
      });
    noticeOfTrialIssuedWithClinicLetter = await applicationContext
      .getUtilities()
      .combineTwoPdfs({
        firstPdf: noticeOfTrialIssued,
        secondPdf: clinicLetter,
      });

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      document: noticeOfTrialIssuedWithClinicLetter,
      key: newNoticeOfTrialIssuedDocumentStorageId,
    });
  } else {
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      document: noticeOfTrialIssued,
      key: newNoticeOfTrialIssuedDocumentStorageId,
    });
  }

  const trialSessionStartDate = applicationContext
    .getUtilities()
    .formatDateString(trialSession.startDate, 'MMDDYYYY');

  const noticeOfTrialDocumentTitle = `Notice of Trial on ${trialSessionStartDate} at ${trialSession.trialLocation}`;

  const noticeOfTrialDocketEntry = new DocketEntry(
    {
      date: trialSessionEntity.startDate,
      docketEntryId: newNoticeOfTrialIssuedDocumentStorageId,
      documentStorageId: newNoticeOfTrialIssuedDocumentStorageId,
      documentTitle: noticeOfTrialDocumentTitle,
      documentType: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.documentType,
      eventCode: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.eventCode,
      isFileAttached: true,
      isOnDocketRecord: true,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      signedAt: applicationContext.getUtilities().createISODateString(), // The signature is in the template of the document being generated
      trialLocation: trialSessionEntity.trialLocation,
    },
    { authorizedUser: undefined },
  );

  noticeOfTrialDocketEntry.setFiledBy(user);

  noticeOfTrialDocketEntry.numberOfPages = await countPagesInDocument({
    applicationContext,
    documentStorageId: noticeOfTrialDocketEntry.documentStorageId,
  });

  caseEntity.addDocketEntry(noticeOfTrialDocketEntry);
  caseEntity.setNoticeOfTrialDate();

  let standingPretrialFile;
  let standingPretrialDocumentTitle;
  let standingPretrialDocumentEventCode;

  if (procedureType === 'Small') {
    standingPretrialFile = await applicationContext
      .getUseCases()
      .generateStandingPretrialOrderForSmallCaseInteractor(applicationContext, {
        docketNumber: caseEntity.docketNumber,
        trialSessionId: trialSessionEntity.trialSessionId,
      });

    standingPretrialDocumentTitle =
      SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
        .documentType;
    standingPretrialDocumentEventCode =
      SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
        .eventCode;
  } else {
    standingPretrialFile = await applicationContext
      .getUseCases()
      .generateStandingPretrialOrderInteractor(applicationContext, {
        docketNumber: caseEntity.docketNumber,
        trialSessionId: trialSessionEntity.trialSessionId,
      });

    standingPretrialDocumentTitle =
      SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.documentType;
    standingPretrialDocumentEventCode =
      SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.eventCode;
  }

  const newStandingPretrialDocumentStorageId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    document: standingPretrialFile,
    key: newStandingPretrialDocumentStorageId,
  });

  const standingPretrialDocketEntry = new DocketEntry(
    {
      attachments: false,
      description: standingPretrialDocumentTitle,
      docketEntryId: newStandingPretrialDocumentStorageId,
      documentStorageId: newStandingPretrialDocumentStorageId,
      documentTitle: standingPretrialDocumentTitle,
      documentType: standingPretrialDocumentTitle,
      eventCode: standingPretrialDocumentEventCode,
      isFileAttached: true,
      isOnDocketRecord: true,
      judge: trialSessionEntity.judge.name,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    },
    { authorizedUser: undefined },
  );

  standingPretrialDocketEntry.setFiledBy(user);

  standingPretrialDocketEntry.numberOfPages = await countPagesInDocument({
    applicationContext,
    documentStorageId: standingPretrialDocketEntry.documentStorageId,
  });

  caseEntity.addDocketEntry(standingPretrialDocketEntry);

  noticeOfTrialDocketEntry.setAsServed(servedParties.all);
  standingPretrialDocketEntry.setAsServed(servedParties.all);

  caseEntity.updateDocketEntry(noticeOfTrialDocketEntry); // to generate an index
  caseEntity.updateDocketEntry(standingPretrialDocketEntry); // to generate an index

  const { PDFDocument } = await applicationContext.getPdfLib();
  const newPdfDoc = await PDFDocument.create();

  await serveNoticesForCase({
    PDFDocument,
    appendClinicLetter,
    applicationContext,
    caseEntity,
    newPdfDoc,
    noticeDocketEntryEntity: noticeOfTrialDocketEntry,
    noticeOfTrialIssued,
    noticeOfTrialIssuedWithClinicLetter,
    servedParties,
    standingPretrialDocketEntryEntity: standingPretrialDocketEntry,
    standingPretrialFile,
  });

  await updateCaseAndAssociations({
    authorizedUser: undefined,
    caseToUpdate: caseEntity,
  });

  const hasPages = newPdfDoc.getPageCount() > 0;

  if (hasPages) {
    const pdfData = await newPdfDoc.save();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      document: pdfData,
      key: `${jobId}-${docketNumber}`,
      useTempBucket: true,
    });
  }
};

export const generateNoticesForCaseTrialSessionCalendarInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    jobId,
    trialSession,
    userId,
  }: {
    docketNumber: string;
    jobId: string;
    trialSession: RawTrialSession;
    userId: string;
  },
) => {
  const processingJob = await getTrialSessionNotificationProcessing({
    trialSessionId: jobId,
  });
  if (!processingJob)
    throw new NotFoundError(
      `Could not get notification processing job with id ${jobId}`,
    );

  if (processingJob.caseStatuses[docketNumber] === 'processed') {
    applicationContext.logger.warn(
      `skipping the processing of the docketNumber ${docketNumber} for job ${jobId} because it was already processed`,
    );
    return;
  }

  const user = await getUserById({
    userId,
  });

  await updateTrialSessionNotificationProcessing({
    trialSessionId: jobId,
    caseStatus: { [docketNumber]: 'processing' },
  });

  const trialSessionEntity = new TrialSession(trialSession);

  const caseRecord = await getCaseByDocketNumber({
    docketNumber,
  });

  await setNoticeForCase({
    applicationContext,
    caseRecord,
    docketNumber,
    jobId,
    trialSession,
    trialSessionEntity,
    user,
  });

  await updateTrialSessionNotificationProcessing({
    trialSessionId: jobId,
    decrementUnfinishedCases: true,
    caseStatus: { [docketNumber]: 'processed' },
  });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'notice_generation_updated',
    },
    userId,
  });
};
