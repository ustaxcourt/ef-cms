const createApplicationContext = require('../../../src/applicationContext');
const {
  aggregatePartiesForService,
} = require('../../../../shared/src/business/utilities/aggregatePartiesForService');
const {
  DocketEntry,
} = require('../../../../shared/src/business/entities/DocketEntry');
const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../../../shared/src/business/entities/EntityConstants');
const {
  getClinicLetterKey,
} = require('../../../../shared/src/business/utilities/getClinicLetterKey');
const {
  TrialSession,
} = require('../../../../shared/src/business/entities/trialSessions/TrialSession');
const { Case } = require('../../../../shared/src/business/entities/cases/Case');

const copyPagesFromPdf = async ({ copyFrom, copyInto }) => {
  let pagesToCopy = await copyInto.copyPages(
    copyFrom,
    copyFrom.getPageIndices(),
  );

  pagesToCopy.forEach(page => {
    copyInto.addPage(page);
  });
};

const removeLastPage = pdfDocumentData => {
  const totalPages = pdfDocumentData.getPageCount();
  const lastPageIndex = totalPages - 1;
  pdfDocumentData.removePage(lastPageIndex);
};

const shouldAppendClinicLetter = async ({
  applicationContext,
  caseEntity,
  procedureType,
  trialSession,
}) => {
  let appendClinicLetter = false;
  let clinicLetterKey;

  // add clinic letter for ANY pro se petitioner
  for (let petitioner of caseEntity.petitioners) {
    if (
      !caseEntity.isUserIdRepresentedByPrivatePractitioner(petitioner.contactId)
    ) {
      clinicLetterKey = getClinicLetterKey({
        procedureType,
        trialLocation: trialSession.trialLocation,
      });
      const doesClinicLetterExist = await applicationContext
        .getPersistenceGateway()
        .isFileExists({
          applicationContext,
          key: clinicLetterKey,
        });
      if (doesClinicLetterExist) {
        appendClinicLetter = true;
      }
    }
  }
  return { appendClinicLetter, clinicLetterKey };
};

/**
 * serves a notice of trial session and standing pretrial document on electronic
 * recipients and generates paper notices for those that get paper service
 *
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
  noticeDocumentPdfData,
  PDFDocument,
  servedParties,
  standingPretrialDocketEntryEntity,
  standingPretrialPdfData,
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

  const noticeDocumentPdf = await PDFDocument.load(noticeDocumentPdfData);
  const standingPretrialPdf = await PDFDocument.load(standingPretrialPdfData);
  const combinedDocumentsPdf = await PDFDocument.create();

  if (servedParties.paper.length > 0) {
    for (let party of servedParties.paper) {
      let noticeDocumentPdfCopy = await noticeDocumentPdf.copy();

      // practitioners do not have a contactId
      const userId = party.userId || party.contactId;
      if (
        (caseEntity.isPractitioner(userId) ||
          caseEntity.isUserIdRepresentedByPrivatePractitioner(
            party.contactId,
          )) &&
        appendClinicLetter
      ) {
        removeLastPage(noticeDocumentPdfCopy);
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

      await copyPagesFromPdf({
        copyFrom: addressPageDoc,
        copyInto: combinedDocumentsPdf,
      });

      await copyPagesFromPdf({
        copyFrom: noticeDocumentPdfCopy,
        copyInto: combinedDocumentsPdf,
      });

      await copyPagesFromPdf({
        copyFrom: standingPretrialPdf,
        copyInto: combinedDocumentsPdf,
      });
    }
  }

  await copyPagesFromPdf({
    copyFrom: combinedDocumentsPdf,
    copyInto: newPdfDoc,
  });
};

/**
 * generates a notice of trial session and adds to the case
 *
 * @param {object} caseRecord the case data
 * @returns {object} the raw case object
 */
const setNoticeForCase = async ({
  applicationContext,
  caseRecord,
  docketNumber,
  jobId,
  trialSession,
  trialSessionEntity,
  userId,
}) => {
  const { PDFDocument } = await applicationContext.getPdfLib();
  const newPdfDoc = await PDFDocument.create();

  const caseEntity = new Case(caseRecord, { applicationContext });
  const { procedureType } = caseRecord;

  // Notice of Trial Issued
  let noticeOfTrialIssuedFile = await applicationContext
    .getUseCases()
    .generateNoticeOfTrialIssuedInteractor(applicationContext, {
      docketNumber: caseEntity.docketNumber,
      trialSessionId: trialSessionEntity.trialSessionId,
    });

  const servedParties = aggregatePartiesForService(caseEntity);

  // Do we need 203-210?
  const { appendClinicLetter, clinicLetterKey } =
    await shouldAppendClinicLetter({
      applicationContext,
      caseEntity,
      procedureType,
      servedParties,
      trialSession,
    });

  if (appendClinicLetter) {
    const clinicLetter = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: clinicLetterKey,
        protocol: 'S3',
        useTempBucket: false,
      });
    noticeOfTrialIssuedFile = await applicationContext
      .getUtilities()
      .combineTwoPdfs({
        applicationContext,
        firstPdf: noticeOfTrialIssuedFile,
        secondPdf: clinicLetter,
      });
  }

  const newNoticeOfTrialIssuedDocketEntryId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: noticeOfTrialIssuedFile,
    key: newNoticeOfTrialIssuedDocketEntryId,
  });

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
      userId,
    },
    { applicationContext },
  );

  noticeOfTrialDocketEntry.numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId: noticeOfTrialDocketEntry.docketEntryId,
    });

  caseEntity.addDocketEntry(noticeOfTrialDocketEntry);
  caseEntity.setNoticeOfTrialDate();

  // Standing Pretrial Notice/Order
  let standingPretrialFile;
  let standingPretrialDocumentTitle;
  let standingPretrialDocumentEventCode;

  if (procedureType === 'Small') {
    // Generate Standing Pretrial Notice
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
    // Generate Standing Pretrial Order
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
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      signedAt: applicationContext.getUtilities().createISODateString(),
      signedByUserId: trialSessionEntity.judge.userId,
      signedJudgeName: trialSessionEntity.judge.name,
      userId,
    },
    { applicationContext },
  );

  // TODO: the numberOfPages should already be stored somewhere, but it's not
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

  await serveNoticesForCase({
    PDFDocument,
    appendClinicLetter,
    applicationContext,
    caseEntity,
    newPdfDoc,
    noticeDocketEntryEntity: noticeOfTrialDocketEntry,
    noticeDocumentPdfData: noticeOfTrialIssuedFile,
    servedParties,
    standingPretrialDocketEntryEntity: standingPretrialDocketEntry,
    standingPretrialPdfData: standingPretrialFile,
  });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });

  const pdfData = await newPdfDoc.save();
  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: pdfData,
    key: `${jobId}-${docketNumber}`,
    useTempBucket: true,
  });
};

exports.handler = async event => {
  const applicationContext = createApplicationContext({});

  const { docketNumber, jobId, trialSession, userId } = event;
  console.log({ docketNumber, jobId, trialSession, userId });

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
    userId,
  });

  await applicationContext.getPersistenceGateway().decrementJobCounter({
    applicationContext,
    jobId,
  });
};
