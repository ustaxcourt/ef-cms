import { Case } from '../../entities/cases/Case';
import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../entities/EntityConstants';
import { DocketEntry } from '../../entities/DocketEntry';
import {
  RawTrialSession,
  TrialSession,
} from '../../entities/trialSessions/TrialSession';
import { aggregatePartiesForService } from '../../utilities/aggregatePartiesForService';
import { copyPagesAndAppendToTargetPdf } from '../../utilities/copyPagesAndAppendToTargetPdf';
import { shouldAppendClinicLetter } from '../../utilities/shouldAppendClinicLetter';

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
    for (let party of servedParties.paper) {
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
}) => {
  const caseEntity = new Case(caseRecord, { applicationContext });
  const { procedureType } = caseRecord;

  let noticeOfTrialIssued = await applicationContext
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
  const newNoticeOfTrialIssuedDocketEntryId = applicationContext.getUniqueId();
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
        applicationContext,
        firstPdf: noticeOfTrialIssued,
        secondPdf: clinicLetter,
      });

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: noticeOfTrialIssuedWithClinicLetter,
      key: newNoticeOfTrialIssuedDocketEntryId,
    });
  } else {
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: noticeOfTrialIssued,
      key: newNoticeOfTrialIssuedDocketEntryId,
    });
  }

  const trialSessionStartDate = applicationContext
    .getUtilities()
    .formatDateString(trialSession.startDate, 'MMDDYYYY');

  const noticeOfTrialDocumentTitle = `Notice of Trial on ${trialSessionStartDate} at ${trialSession.trialLocation}`;

  const noticeOfTrialDocketEntry = new DocketEntry(
    {
      date: trialSessionEntity.startDate,
      docketEntryId: newNoticeOfTrialIssuedDocketEntryId,
      documentTitle: noticeOfTrialDocumentTitle,
      documentType: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.documentType,
      eventCode: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.eventCode,
      isFileAttached: true,
      isOnDocketRecord: true,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      signedAt: applicationContext.getUtilities().createISODateString(), // The signature is in the template of the document being generated
      trialLocation: trialSessionEntity.trialLocation,
    },
    { applicationContext },
  );

  noticeOfTrialDocketEntry.setFiledBy(user);

  noticeOfTrialDocketEntry.numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId: noticeOfTrialDocketEntry.docketEntryId,
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

  const newStandingPretrialDocketEntryId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: standingPretrialFile,
    key: newStandingPretrialDocketEntryId,
  });

  const standingPretrialDocketEntry = new DocketEntry(
    {
      attachments: false,
      description: standingPretrialDocumentTitle,
      docketEntryId: newStandingPretrialDocketEntryId,
      documentTitle: standingPretrialDocumentTitle,
      documentType: standingPretrialDocumentTitle,
      eventCode: standingPretrialDocumentEventCode,
      isFileAttached: true,
      isOnDocketRecord: true,
      judge: trialSessionEntity.judge.name,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    },
    { applicationContext },
  );

  standingPretrialDocketEntry.setFiledBy(user);

  standingPretrialDocketEntry.numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId: standingPretrialDocketEntry.docketEntryId,
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

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });

  const hasPages = newPdfDoc.getPageCount() > 0;

  if (hasPages) {
    const pdfData = await newPdfDoc.save();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: pdfData,
      key: `${jobId}-${docketNumber}`,
      useTempBucket: true,
    });
  }
};

export const generateNoticesForCaseTrialSessionCalendarInteractor = async (
  applicationContext: IApplicationContext,
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
  const jobStatus = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionJobStatusForCase({
      applicationContext,
      jobId,
    });

  if (jobStatus[docketNumber] === 'processed') {
    applicationContext.logger.warn(
      `skipping the processing of the docketNumber ${docketNumber} for job ${jobId} because it was already processed`,
    );
    return;
  }

  const user = await applicationContext.getPersistenceGateway().getUserById({
    applicationContext,
    userId,
  });

  await applicationContext
    .getPersistenceGateway()
    .setTrialSessionJobStatusForCase({
      applicationContext,
      docketNumber,
      jobId,
      status: 'processing',
    });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
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

  await applicationContext.getPersistenceGateway().decrementJobCounter({
    applicationContext,
    jobId,
  });

  await applicationContext
    .getPersistenceGateway()
    .setTrialSessionJobStatusForCase({
      applicationContext,
      docketNumber,
      jobId,
      status: 'processed',
    });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'notice_generation_updated',
    },
    userId,
  });
};
