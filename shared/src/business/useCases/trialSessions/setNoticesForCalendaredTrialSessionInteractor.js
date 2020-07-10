const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  NOTICE_OF_TRIAL,
  STANDING_PRETRIAL_NOTICE,
  STANDING_PRETRIAL_ORDER,
} = require('../../entities/EntityConstants');
const { Case } = require('../../entities/cases/Case');
const { Document } = require('../../entities/Document');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * Generates notices for all calendared cases for the given trialSessionId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {string} providers.trialSessionId the trial session id
 * @param {string} providers.caseId optional caseId to explicitly set the notice on the ONE specified case
 * @returns {Promise} the promises for the updateCase calls
 */
exports.setNoticesForCalendaredTrialSessionInteractor = async ({
  applicationContext,
  caseId,
  trialSessionId,
}) => {
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
  if (caseId) {
    // Do not set when sending notices for a single case
    shouldSetNoticesIssued = false;

    const singleCase = calendaredCases.find(
      caseRecord => caseRecord.caseId === caseId,
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
      .generateNoticeOfTrialIssuedInteractor({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
        trialSessionId: trialSessionEntity.trialSessionId,
      });

    const newNoticeOfTrialIssuedDocumentId = applicationContext.getUniqueId();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: noticeOfTrialIssuedFile,
      documentId: newNoticeOfTrialIssuedDocumentId,
    });

    const trialSessionStartDate = applicationContext
      .getUtilities()
      .formatDateString(trialSession.startDate, 'MMDDYYYY');

    const noticeOfTrialDocumentTitle = `Notice of Trial on ${trialSessionStartDate} at ${trialSession.trialLocation}`;

    const noticeOfTrialDocument = new Document(
      {
        caseId: caseEntity.caseId,
        documentId: newNoticeOfTrialIssuedDocumentId,
        documentTitle: noticeOfTrialDocumentTitle,
        documentType: NOTICE_OF_TRIAL.documentType,
        eventCode: NOTICE_OF_TRIAL.eventCode,
        processingStatus: 'complete',
        signedAt: applicationContext.getUtilities().createISODateString(), // The signature is in the template of the document being generated
        userId: user.userId,
      },
      { applicationContext },
    );

    caseEntity.addDocument(noticeOfTrialDocument, { applicationContext });
    caseEntity.setNoticeOfTrialDate();

    // Standing Pretrial Notice/Order
    let standingPretrialFile;
    let standingPretrialDocumentTitle;
    let standingPretrialDocumentEventCode;

    if (procedureType === 'Small') {
      // Generate Standing Pretrial Notice
      standingPretrialFile = await applicationContext
        .getUseCases()
        .generateStandingPretrialNoticeInteractor({
          applicationContext,
          docketNumber: caseEntity.docketNumber,
          trialSessionId: trialSessionEntity.trialSessionId,
        });

      standingPretrialDocumentTitle = STANDING_PRETRIAL_NOTICE.documentType;
      standingPretrialDocumentEventCode = STANDING_PRETRIAL_NOTICE.eventCode;
    } else {
      // Generate Standing Pretrial Order
      standingPretrialFile = await applicationContext
        .getUseCases()
        .generateStandingPretrialOrderInteractor({
          applicationContext,
          docketNumber: caseEntity.docketNumber,
          trialSessionId: trialSessionEntity.trialSessionId,
        });

      standingPretrialDocumentTitle = STANDING_PRETRIAL_ORDER.documentType;
      standingPretrialDocumentEventCode = STANDING_PRETRIAL_ORDER.eventCode;
    }

    const newStandingPretrialDocumentId = applicationContext.getUniqueId();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: standingPretrialFile,
      documentId: newStandingPretrialDocumentId,
    });

    const standingPretrialDocument = new Document(
      {
        caseId: caseEntity.caseId,
        documentId: newStandingPretrialDocumentId,
        documentTitle: standingPretrialDocumentTitle,
        documentType: standingPretrialDocumentTitle,
        eventCode: standingPretrialDocumentEventCode,
        processingStatus: 'complete',
        userId: user.userId,
      },
      { applicationContext },
    );

    caseEntity.addDocument(standingPretrialDocument, { applicationContext });

    // Serve notice
    const servedParties = await serveNoticesForCase({
      caseEntity,
      noticeDocumentEntity: noticeOfTrialDocument,
      noticeDocumentPdfData: noticeOfTrialIssuedFile,
      standingPretrialDocumentEntity: standingPretrialDocument,
      standingPretrialPdfData: standingPretrialFile,
    });

    noticeOfTrialDocument.setAsServed(servedParties.all);
    standingPretrialDocument.setAsServed(servedParties.all);

    const rawCase = caseEntity.validate().toRawObject();
    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: rawCase,
    });

    return rawCase;
  };

  /**
   * serves a notice of trial session and standing pretrial document on electronic
   * recipients and generates paper notices for those that get paper service
   *
   * @param {object} deconstructed function arguments
   * @param {object} deconstructed.caseEntity the case entity
   * @param {object} deconstructed.noticeDocumentEntity the notice document entity
   * @param {Uint8Array} deconstructed.noticeDocumentPdfData the pdf data of the notice doc
   * @param {object} deconstructed.standingPretrialDocumentEntity the standing pretrial document entity
   * @param {Uint8Array} deconstructed.standingPretrialPdfData the pdf data of the standing pretrial doc
   * @returns {object} sends service emails and updates `newPdfDoc` with paper service pages for printing returning served servedParties
   */
  const serveNoticesForCase = async ({
    caseEntity,
    noticeDocumentEntity,
    noticeDocumentPdfData,
    standingPretrialDocumentEntity,
    standingPretrialPdfData,
  }) => {
    const servedParties = aggregatePartiesForService(caseEntity);

    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      documentEntity: noticeDocumentEntity,
      servedParties,
    });

    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      documentEntity: standingPretrialDocumentEntity,
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

    return servedParties;
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
  let documentId = null;
  let pdfUrl = null;
  if (hasPaper) {
    const paperServicePdfData = await newPdfDoc.save();
    documentId = applicationContext.getUniqueId();
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: paperServicePdfData,
      documentId,
      useTempBucket: true,
    });
    hasPaper = true;

    pdfUrl = (
      await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
        applicationContext,
        documentId,
        useTempBucket: true,
      })
    ).url;
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'notice_generation_complete',
      documentId,
      hasPaper,
      pdfUrl,
    },
    userId: user.userId,
  });
};
