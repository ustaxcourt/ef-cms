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
const { getClinicLetterKey } = require('../../utilities/getClinicLetterKey');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

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
  newPdfDoc,
  PDFDocument,
  trialSession,
  trialSessionEntity,
  user,
}) => {
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
      userId: user.userId,
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

  return caseEntity.toRawObject();
};

/**
 * Generates notices for all calendared cases for the given trialSessionId
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the trial session id
 * @param {string} providers.docketNumber optional docketNumber to explicitly set the notice on the ONE specified case
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

  // let processedCases = 0;
  for (let calendaredCase of calendaredCases) {
    // TODO: async invoke the lambda
    // TODO: maybe see if we can do .promise on this
    applicationContext.invokeLambda(
      {
        FunctionName: `set_trial_session_${process.env.STAGE}_${process.env.CURRENT_COLOR}`,
        InvocationType: 'Event',
        Payload: JSON.stringify({
          docketNumber: calendaredCase.docketNumber,
          trialSessionId: trialSessionEntity.trialSessionId,
        }),
      },
      (err, data) => {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
      },
    );

    // const latestVersionOfCase = await applicationContext
    //   .getPersistenceGateway()
    //   .getCaseByDocketNumber({
    //     applicationContext,
    //     docketNumber: calendaredCase.docketNumber,
    //   });

    // await setNoticeForCase({
    //   PDFDocument,
    //   applicationContext,
    //   caseRecord: latestVersionOfCase,
    //   newPdfDoc,
    //   trialSession,
    //   trialSessionEntity,
    //   user,
    // });
    // processedCases++;
    // await applicationContext.getNotificationGateway().sendNotificationToUser({
    //   applicationContext,
    //   message: {
    //     action: 'notice_generation_update_progress',
    //     processedCases,
    //     totalCases: latestVersionOfCase.length,
    //   },
    //   userId: user.userId,
    // });
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

  let pdfUrl = null;
  const serviceInfo = await applicationContext
    .getUseCaseHelpers()
    .savePaperServicePdf({
      applicationContext,
      document: newPdfDoc,
    });
  pdfUrl = serviceInfo.url;

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'notice_generation_complete',
      docketEntryId: serviceInfo.docketEntryId,
      hasPaper: serviceInfo.hasPaper,
      pdfUrl,
    },
    userId: user.userId,
  });
};
