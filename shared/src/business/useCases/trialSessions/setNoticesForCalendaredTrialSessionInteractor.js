const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * Generates notices for all calendared cases for the given trialSessionId
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the trial session id
 * @param {string} providers.docketNumber optional docketNumber to explicitly set the notice on the ONE specified case
 * @returns {Promise} the promises for the updateCase calls
 */
exports.setNoticesForCalendaredTrialSessionInteractor = async (
  applicationContext,
  { docketNumber, trialSessionId },
) => {
  let shouldSetNoticesIssued = true;
  const user = applicationContext.getCurrentUser();

  const { PDFDocument } = await applicationContext.getPdfLib();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let calendaredCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  // opting to pull from the set of calendared cases rather than load the
  // case individually to add an additional layer of validation
  if (docketNumber) {
    // Do not set when sending notices for a single case
    shouldSetNoticesIssued = false;

    const singleCase = calendaredCases.find(
      caseRecord => caseRecord.docketNumber === docketNumber,
    );

    calendaredCases = [singleCase];
  }

  if (calendaredCases.length === 0) {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'notice_generation_complete',
        hasPaper: false,
      },
      userId: user.userId,
    });

    return;
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  const newPdfDoc = await PDFDocument.create();

  /**
   * generates a notice of trial session and adds to the case
   *
   * @param {object} caseRecord the case data
   * @returns {object} the raw case object
   */
  const setNoticeForCase = async caseRecord => {
    const caseEntity = new Case(caseRecord, { applicationContext });
    const { procedureType } = caseRecord;

    // Notice of Trial Issued
    const noticeOfTrialIssuedFile = await applicationContext
      .getUseCases()
      .generateNoticeOfTrialIssuedInteractor(applicationContext, {
        docketNumber: caseEntity.docketNumber,
        trialSessionId: trialSessionEntity.trialSessionId,
      });

    const newNoticeOfTrialIssuedDocketEntryId =
      applicationContext.getUniqueId();

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
        documentType:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.documentType,
        eventCode: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.eventCode,
        isFileAttached: true,
        isOnDocketRecord: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        signedAt: applicationContext.getUtilities().createISODateString(), // The signature is in the template of the document being generated
        trialLocation: trialSessionEntity.trialLocation,
        userId: user.userId,
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
        .generateStandingPretrialOrderForSmallCaseInteractor(
          applicationContext,
          {
            docketNumber: caseEntity.docketNumber,
            trialSessionId: trialSessionEntity.trialSessionId,
          },
        );

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
        userId: user.userId,
      },
      { applicationContext },
    );

    standingPretrialDocketEntry.numberOfPages = await applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument({
        applicationContext,
        docketEntryId: standingPretrialDocketEntry.docketEntryId,
      });

    caseEntity.addDocketEntry(standingPretrialDocketEntry);

    const servedParties = aggregatePartiesForService(caseEntity);

    noticeOfTrialDocketEntry.setAsServed(servedParties.all);
    standingPretrialDocketEntry.setAsServed(servedParties.all);

    caseEntity.updateDocketEntry(noticeOfTrialDocketEntry); // to generate an index
    caseEntity.updateDocketEntry(standingPretrialDocketEntry); // to generate an index

    // Serve notice
    await serveNoticesForCase({
      caseEntity,
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

    return caseEntity.toRawObject();
  };

  /**
   * serves a notice of trial session and standing pretrial document on electronic
   * recipients and generates paper notices for those that get paper service
   *
   * @param {object} deconstructed function arguments
   * @param {object} deconstructed.caseEntity the case entity
   * @param {object} deconstructed.noticeDocketEntryEntity the notice document entity
   * @param {Uint8Array} deconstructed.noticeDocumentPdfData the pdf data of the notice doc
   * @param {object} deconstructed.servedParties the parties to serve
   * @param {object} deconstructed.standingPretrialDocketEntryEntity the standing pretrial document entity
   * @param {Uint8Array} deconstructed.standingPretrialPdfData the pdf data of the standing pretrial doc
   */
  const serveNoticesForCase = async ({
    caseEntity,
    noticeDocketEntryEntity,
    noticeDocumentPdfData,
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

    if (servedParties.paper.length > 0) {
      const combinedDocumentsPdf = await PDFDocument.create();
      const noticeDocumentPdf = await PDFDocument.load(noticeDocumentPdfData);
      const standingPretrialPdf = await PDFDocument.load(
        standingPretrialPdfData,
      );

      let copiedPages = await combinedDocumentsPdf.copyPages(
        noticeDocumentPdf,
        noticeDocumentPdf.getPageIndices(),
      );

      copiedPages = copiedPages.concat(
        await combinedDocumentsPdf.copyPages(
          standingPretrialPdf,
          standingPretrialPdf.getPageIndices(),
        ),
      );

      copiedPages.forEach(page => {
        combinedDocumentsPdf.addPage(page);
      });

      await applicationContext
        .getUseCaseHelpers()
        .appendPaperServiceAddressPageToPdf({
          applicationContext,
          caseEntity,
          newPdfDoc,
          noticeDoc: combinedDocumentsPdf,
          servedParties,
        });
    }
  };

  for (let calendaredCase of calendaredCases) {
    await setNoticeForCase(calendaredCase);
  }

  // Prevent from being overwritten when generating notices for a manually-added
  // case, after the session has been set (see above)
  if (shouldSetNoticesIssued) {
    await trialSessionEntity.setNoticesIssued();

    await applicationContext.getPersistenceGateway().updateTrialSession({
      applicationContext,
      trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
    });
  }

  let hasPaper = newPdfDoc.getPages().length;
  let docketEntryId = null;
  let pdfUrl = null;
  if (hasPaper) {
    const paperServicePdfData = await newPdfDoc.save();
    docketEntryId = applicationContext.getUniqueId();
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: paperServicePdfData,
      key: docketEntryId,
      useTempBucket: true,
    });
    hasPaper = true;

    pdfUrl = (
      await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
        applicationContext,
        key: docketEntryId,
        useTempBucket: true,
      })
    ).url;
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'notice_generation_complete',
      docketEntryId,
      hasPaper,
      pdfUrl,
    },
    userId: user.userId,
  });
};
