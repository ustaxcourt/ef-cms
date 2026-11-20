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
import { shouldAppendClinicLetter } from '@web-api/business/utilities/shouldAppendClinicLetter';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { updateTrialSessionNotificationProcessing } from '@web-api/persistence/postgres/trialSessions/updateTrialSessionNotificationProcessing';
import { getTrialSessionNotificationProcessing } from '@web-api/persistence/postgres/trialSessions/getTrialSessionNotificationProcessing';
import { NotFoundError } from '@web-api/errors/errors';
import { countPagesInDocument } from '@web-api/business/useCaseHelper/countPagesInDocument';
import { getJudgeWithTitle } from '@web-api/business/utilities/getJudgeWithTitle';
import { replaceBracketed } from '@shared/business/utilities/replaceBracketed';
import {
  inTransaction,
  onTransactionCommit,
  withTransaction,
} from '@web-api/persistence/postgres/utils/transactions';

type NoticeDocument = {
  docketEntryInfo: {
    date?: string;
    documentTitle: string;
    documentType: string;
    eventCode: string;
    judge?: string;
    signedAt?: string;
    trialLocation?: string;
  };
  file: Uint8Array;
};

type StandingOrderDocument = {
  documentTitle: string;
  eventCode: string;
  file: Uint8Array;
};

/**
 * generates the notice that tells the parties about the trial session: a
 * Notice of Assignment of Judge for Reporting sessions, otherwise a Notice of
 * Trial
 */
const generateNoticeDocument = async ({
  applicationContext,
  docketNumber,
  trialSession,
  trialSessionEntity,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
  trialSession: RawTrialSession;
  trialSessionEntity: TrialSession;
}): Promise<NoticeDocument> => {
  const generateParams = {
    docketNumber,
    trialSessionId: trialSessionEntity.trialSessionId,
  };

  if (trialSessionEntity.isReporting()) {
    const file = await applicationContext
      .getUseCases()
      .generateNoticeOfAssignmentOfJudgeInteractor(
        applicationContext,
        generateParams,
      );

    const judgeWithTitle = await getJudgeWithTitle({
      judgeUserName: trialSessionEntity.judge?.name,
    });

    return {
      docketEntryInfo: {
        documentTitle: replaceBracketed(
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfAssignmentOfJudge
            .documentTitle,
          judgeWithTitle,
        ),
        documentType:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfAssignmentOfJudge
            .documentType,
        eventCode:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfAssignmentOfJudge.eventCode,
        judge: trialSessionEntity.judge?.name,
      },
      file,
    };
  }

  const file = await applicationContext
    .getUseCases()
    .generateNoticeOfTrialIssuedInteractor(applicationContext, generateParams);

  const trialSessionStartDate = applicationContext
    .getUtilities()
    .formatDateString(trialSession.startDate, 'MMDDYYYY');

  return {
    docketEntryInfo: {
      date: trialSessionEntity.startDate,
      documentTitle: `Notice of Trial on ${trialSessionStartDate} at ${trialSession.trialLocation}`,
      documentType: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.documentType,
      eventCode: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.eventCode,
      signedAt: applicationContext.getUtilities().createISODateString(), // The signature is in the template of the document being generated
      trialLocation: trialSessionEntity.trialLocation,
    },
    file,
  };
};

/**
 * generates the standing order served with the notice: a Standing Scheduling
 * Order for Reporting sessions, otherwise a Standing Pretrial Order
 */
const generateStandingOrderDocument = async ({
  applicationContext,
  docketNumber,
  procedureType,
  trialSessionEntity,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
  procedureType: string;
  trialSessionEntity: TrialSession;
}): Promise<StandingOrderDocument> => {
  const generateParams = {
    docketNumber,
    trialSessionId: trialSessionEntity.trialSessionId,
  };

  if (trialSessionEntity.isReporting()) {
    return {
      documentTitle:
        SYSTEM_GENERATED_DOCUMENT_TYPES.standingSchedulingOrder.documentType,
      eventCode:
        SYSTEM_GENERATED_DOCUMENT_TYPES.standingSchedulingOrder.eventCode,
      file: await applicationContext
        .getUseCases()
        .generateStandingSchedulingOrderInteractor(
          applicationContext,
          generateParams,
        ),
    };
  }

  if (procedureType === 'Small') {
    return {
      documentTitle:
        SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
          .documentType,
      eventCode:
        SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
          .eventCode,
      file: await applicationContext
        .getUseCases()
        .generateStandingPretrialOrderForSmallCaseInteractor(
          applicationContext,
          generateParams,
        ),
    };
  }

  return {
    documentTitle:
      SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.documentType,
    eventCode: SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrder.eventCode,
    file: await applicationContext
      .getUseCases()
      .generateStandingPretrialOrderInteractor(
        applicationContext,
        generateParams,
      ),
  };
};

/**
 * serves the trial session notice and standing order on electronic recipients
 * and generates paper copies for those that get paper service
 */
const serveNoticesForCase = async ({
  appendClinicLetter,
  applicationContext,
  caseEntity,
  newPdfDoc,
  noticeDocketEntryEntity,
  noticeFile,
  noticeFileWithClinicLetter,
  PDFDocument,
  servedParties,
  standingOrderDocketEntryEntity,
  standingOrderFile,
}) => {
  const sendEmails = async () => {
    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryId: noticeDocketEntryEntity.docketEntryId,
      servedParties,
    });

    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryId: standingOrderDocketEntryEntity.docketEntryId,
      servedParties,
    });
  };

  if (inTransaction()) {
    onTransactionCommit(sendEmails);
  } else {
    await sendEmails();
  }

  const standingOrderPdf = await PDFDocument.load(standingOrderFile);
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
        noticeDocumentPdf = await PDFDocument.load(noticeFileWithClinicLetter);
      } else {
        noticeDocumentPdf = await PDFDocument.load(noticeFile);
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
        copyFrom: standingOrderPdf,
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
 * generates the trial session notice and standing order, adds them to the
 * case docket record, and serves them
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
  caseRecord: RawCase;
  docketNumber: string;
  jobId: string;
  trialSession: RawTrialSession;
  trialSessionEntity: TrialSession;
  user: Parameters<DocketEntry['setFiledBy']>[0];
}): Promise<void> => {
  const caseEntity = new Case(caseRecord, { authorizedUser: undefined });
  const { procedureType } = caseRecord;

  const { docketEntryInfo: noticeDocketEntryInfo, file: noticeFile } =
    await generateNoticeDocument({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
      trialSession,
      trialSessionEntity,
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
  let noticeFileWithClinicLetter;
  const newNoticeDocumentStorageId = applicationContext.getUniqueId();
  if (appendClinicLetter) {
    clinicLetter = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: clinicLetterKey,
        useTempBucket: false,
      });
    noticeFileWithClinicLetter = await applicationContext
      .getUtilities()
      .combineTwoPdfs({
        firstPdf: noticeFile,
        secondPdf: clinicLetter,
      });

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      document: noticeFileWithClinicLetter,
      key: newNoticeDocumentStorageId,
    });
  } else {
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      document: noticeFile,
      key: newNoticeDocumentStorageId,
    });
  }

  const noticeDocketEntry = new DocketEntry(
    {
      ...noticeDocketEntryInfo,
      docketEntryId: newNoticeDocumentStorageId,
      documentStorageId: newNoticeDocumentStorageId,
      isFileAttached: true,
      isOnDocketRecord: true,
      originallyFiledDocketNumber: caseEntity.docketNumber,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    },
    { authorizedUser: undefined },
  );

  noticeDocketEntry.setFiledBy(user);

  noticeDocketEntry.numberOfPages = await countPagesInDocument({
    applicationContext,
    documentStorageId: noticeDocketEntry.documentStorageId,
  });

  caseEntity.addDocketEntry(noticeDocketEntry);

  if (!trialSessionEntity.isReporting()) {
    caseEntity.setNoticeOfTrialDate();
  }

  const {
    documentTitle: standingOrderDocumentTitle,
    eventCode: standingOrderEventCode,
    file: standingOrderFile,
  } = await generateStandingOrderDocument({
    applicationContext,
    docketNumber: caseEntity.docketNumber,
    procedureType,
    trialSessionEntity,
  });

  const newStandingOrderDocumentStorageId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    document: standingOrderFile,
    key: newStandingOrderDocumentStorageId,
  });

  const standingOrderDocketEntry = new DocketEntry(
    {
      attachments: false,
      description: standingOrderDocumentTitle,
      docketEntryId: newStandingOrderDocumentStorageId,
      documentStorageId: newStandingOrderDocumentStorageId,
      documentTitle: standingOrderDocumentTitle,
      documentType: standingOrderDocumentTitle,
      eventCode: standingOrderEventCode,
      isFileAttached: true,
      isOnDocketRecord: true,
      originallyFiledDocketNumber: caseEntity.docketNumber,
      judge: trialSessionEntity.judge?.name,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    },
    { authorizedUser: undefined },
  );

  standingOrderDocketEntry.setFiledBy(user);

  standingOrderDocketEntry.numberOfPages = await countPagesInDocument({
    applicationContext,
    documentStorageId: standingOrderDocketEntry.documentStorageId,
  });

  caseEntity.addDocketEntry(standingOrderDocketEntry);

  noticeDocketEntry.setAsServed(servedParties.all);
  standingOrderDocketEntry.setAsServed(servedParties.all);

  caseEntity.updateDocketEntry(noticeDocketEntry); // to generate an index
  caseEntity.updateDocketEntry(standingOrderDocketEntry); // to generate an index

  const { PDFDocument } = await applicationContext.getPdfLib();
  const newPdfDoc = await PDFDocument.create();

  await serveNoticesForCase({
    PDFDocument,
    appendClinicLetter,
    applicationContext,
    caseEntity,
    newPdfDoc,
    noticeDocketEntryEntity: noticeDocketEntry,
    noticeFile,
    noticeFileWithClinicLetter,
    servedParties,
    standingOrderDocketEntryEntity: standingOrderDocketEntry,
    standingOrderFile,
  });

  await withTransaction(async () => {
    await updateCaseAndAssociations({
      authorizedUser: undefined,
      caseToUpdate: caseEntity,
    });
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
): Promise<void> => {
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

  if (!user) {
    throw new NotFoundError(`User ${userId} was not found.`);
  }

  await withTransaction(async () => {
    await updateTrialSessionNotificationProcessing({
      trialSessionId: jobId,
      caseStatus: { [docketNumber]: 'processing' },
    });
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

  await withTransaction(async () => {
    await updateTrialSessionNotificationProcessing({
      trialSessionId: jobId,
      decrementUnfinishedCases: true,
      caseStatus: { [docketNumber]: 'processed' },
    });
  });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'notice_generation_updated',
    },
    userId,
  });
};
