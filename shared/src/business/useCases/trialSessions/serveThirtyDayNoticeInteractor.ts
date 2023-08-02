import {
  COURT_ISSUED_EVENT_CODES,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { Case } from '../../entities/cases/Case';
import { FORMATS, formatDateString } from '../../utilities/DateHandler';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { getCaseCaptionMeta } from '../../utilities/getCaseCaptionMeta';
import { getClinicLetterKey } from '../../utilities/getClinicLetterKey';
import { replaceBracketed } from '../../utilities/replaceBracketed';

export type ServeThirtyDayNoticeRequest = {
  trialSessionId: string;
};

export const serveThirtyDayNoticeInteractor = async (
  applicationContext: IApplicationContext,
  request: ServeThirtyDayNoticeRequest,
): Promise<void> => {
  const currentUser = applicationContext.getCurrentUser();

  if (!isAuthorized(currentUser, ROLE_PERMISSIONS.DISMISS_NOTT_REMINDER)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (!request.trialSessionId) {
    throw new InvalidRequest('No trial Session Id provided');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId: request.trialSessionId,
    });

  if (!trialSession.caseOrder?.length) {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'thirty_day_notice_paper_service_complete',
        pdfUrl: undefined,
      },
      userId: currentUser.userId,
    });
    return;
  }

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  const { PDFDocument } = await applicationContext.getPdfLib();
  const paperServicePdf = await PDFDocument.create();
  const thirtyDayNoticeDocumentInfo = COURT_ISSUED_EVENT_CODES.find(
    doc => doc.eventCode === 'NOTT',
  );

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'paper_service_started',
      totalPdfs: trialSession.caseOrder.length,
    },
    userId: currentUser.userId,
  });

  let pdfsAppended: number = 0;
  let hasPaperService = false;
  const generateNottForCases = trialSession.caseOrder.map(async aCase => {
    const rawCase = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber: aCase.docketNumber,
      });

    const caseEntity = new Case(rawCase, { applicationContext });

    let clinicLetter;
    const clinicLetterKey = getClinicLetterKey({
      procedureType: caseEntity.procedureType,
      trialLocation: trialSession.trialLocation,
    });

    const doesClinicLetterExist = await applicationContext
      .getPersistenceGateway()
      .isFileExists({
        applicationContext,
        key: clinicLetterKey,
      });

    if (doesClinicLetterExist) {
      clinicLetter = await applicationContext
        .getPersistenceGateway()
        .getDocument({
          applicationContext,
          key: clinicLetterKey,
          protocol: 'S3',
          useTempBucket: false,
        });
    }

    const hasProSePetitioner = caseEntity.petitioners.some(
      petitioner =>
        !Case.isPetitionerRepresented(caseEntity, petitioner.contactId),
    );
    if (hasProSePetitioner) {
      const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta({
        caseCaption: caseEntity.caseCaption,
      });

      let noticePdf = await applicationContext
        .getDocumentGenerators()
        .thirtyDayNoticeOfTrial({
          applicationContext,
          data: {
            caseCaptionExtension,
            caseTitle,
            dateServed: applicationContext.getUtilities().formatNow('MM/dd/yy'),
            docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
            judgeName: trialSession.judge!.name,
            proceedingType: trialSession.proceedingType,
            scopeType: trialSession.sessionScope,
            trialDate: trialSession.startDate,
            trialLocation: {
              address1: trialSession.address1,
              address2: trialSession.address2,
              cityState: trialSession.trialLocation,
              courthouseName: trialSession.courthouseName,
              postalCode: trialSession.postalCode,
            },
          },
        });

      if (doesClinicLetterExist) {
        noticePdf = await applicationContext.getUtilities().combineTwoPdfs({
          applicationContext,
          firstPdf: noticePdf,
          secondPdf: clinicLetter,
        });
      }

      await applicationContext
        .getUseCaseHelpers()
        .createAndServeNoticeDocketEntry(applicationContext, {
          additionalDocketEntryInfo: {
            date: trialSession.startDate,
            trialLocation: trialSession.trialLocation,
          },
          caseEntity,
          documentInfo: {
            documentTitle: replaceBracketed(
              thirtyDayNoticeDocumentInfo!.documentTitle,
              formatDateString(trialSession.startDate, FORMATS.MMDDYYYY_DASHED),
              trialSession.trialLocation,
            ),
            documentType: thirtyDayNoticeDocumentInfo!.documentType,
            eventCode: thirtyDayNoticeDocumentInfo!.eventCode,
          },
          newPdfDoc: paperServicePdf,
          noticePdf,
          onlyProSePetitioners: true,
          userId: currentUser.userId,
        });

      await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        caseToUpdate: caseEntity,
      });

      pdfsAppended++;

      hasPaperService =
        hasPaperService ||
        caseEntity.hasPartyWithServiceType(SERVICE_INDICATOR_TYPES.SI_PAPER);

      await applicationContext.getNotificationGateway().sendNotificationToUser({
        applicationContext,
        message: {
          action: 'paper_service_updated',
          pdfsAppended,
        },
        userId: currentUser.userId,
      });
    }
  });

  await Promise.all(generateNottForCases);

  let pdfUrl: string | undefined = undefined;
  if (hasPaperService) {
    const paperServicePdfData = await paperServicePdf.save();
    const { url } = await applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl({
        applicationContext,
        file: paperServicePdfData,
        useTempBucket: true,
      });
    pdfUrl = url;
  }

  trialSessionEntity.hasNOTTBeenServed = true;

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'thirty_day_notice_paper_service_complete',
      hasPaper: hasPaperService,
      pdfUrl,
    },
    userId: currentUser.userId,
  });
};
