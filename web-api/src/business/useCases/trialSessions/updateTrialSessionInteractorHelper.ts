import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { PDFDocument as PDFDocumentType } from 'pdf-lib';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { get } from 'lodash';

type GetCasesInTrialSessionParams = {
  applicationContext: ServerApplicationContext;
  trialSession: RawTrialSession;
  authorizedUser: AuthUser;
};

export async function getCasesInTrialSession({
  applicationContext,
  trialSession,
  authorizedUser,
}: GetCasesInTrialSessionParams): Promise<{
  calendaredCaseEntities: Case[];
  casesThatShouldReceiveNotices: Case[];
}> {
  const calendaredCaseEntities = await Promise.all(
    trialSession
      .caseOrder!.filter(c => !c.removedFromTrial)
      .map(async c => {
        const aCase = await applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber({
            applicationContext,
            docketNumber: c.docketNumber,
          });
        return new Case(aCase, { authorizedUser });
      }),
  );

  const casesThatShouldReceiveNotices = calendaredCaseEntities
    .filter(aCase => !aCase.isClosed())
    .filter(aCase => aCase.trialSessionId === trialSession.trialSessionId);

  return { calendaredCaseEntities, casesThatShouldReceiveNotices };
}

type UpdateCasesAndSetNoticeOfChangeParams = {
  applicationContext: ServerApplicationContext;
  currentTrialSession: RawTrialSession;
  updatedTrialSessionEntity: TrialSession;
  authorizedUser: AuthUser;
  shouldSetNoticeOfChangeToRemoteProceeding: boolean;
  shouldSetNoticeOfTrialSessionLocationChange: boolean;
  shouldSetNoticeOfChangeToInPersonProceeding: boolean;
  shouldIssueNoticeOfChangeOfTrialJudge: boolean;
};

export const updateCasesAndSetNoticeOfChange = async ({
  applicationContext,
  authorizedUser,
  currentTrialSession,
  shouldIssueNoticeOfChangeOfTrialJudge,
  shouldSetNoticeOfChangeToInPersonProceeding,
  shouldSetNoticeOfChangeToRemoteProceeding,
  shouldSetNoticeOfTrialSessionLocationChange,
  updatedTrialSessionEntity,
}: UpdateCasesAndSetNoticeOfChangeParams): Promise<PDFDocumentType> => {
  const { calendaredCaseEntities, casesThatShouldReceiveNotices } =
    await getCasesInTrialSession({
      applicationContext,
      trialSession: currentTrialSession,
      authorizedUser,
    });

  const TASKS = casesThatShouldReceiveNotices.map(async (caseEntity: Case) => {
    const { PDFDocument } = await applicationContext.getPdfLib();
    const newPdfDoc = await PDFDocument.create();

    if (shouldSetNoticeOfChangeToRemoteProceeding) {
      await applicationContext
        .getUseCaseHelpers()
        .setNoticeOfChangeToRemoteProceeding(
          applicationContext,
          {
            caseEntity,
            newPdfDoc,
            newTrialSessionEntity: updatedTrialSessionEntity,
          },
          authorizedUser,
        );
    }

    if (shouldSetNoticeOfChangeToInPersonProceeding) {
      await applicationContext
        .getUseCaseHelpers()
        .setNoticeOfChangeToInPersonProceeding(
          applicationContext,
          {
            caseEntity,
            newPdfDoc,
            newTrialSessionEntity: updatedTrialSessionEntity,
          },
          authorizedUser,
        );
    }

    if (shouldIssueNoticeOfChangeOfTrialJudge) {
      await applicationContext
        .getUseCaseHelpers()
        .setNoticeOfChangeOfTrialJudge(
          applicationContext,
          {
            caseEntity,
            currentTrialSession,
            newPdfDoc,
            newTrialSessionEntity: updatedTrialSessionEntity,
          },
          authorizedUser,
        );
    }

    if (shouldSetNoticeOfTrialSessionLocationChange) {
      await applicationContext
        .getUseCaseHelpers()
        .setNoticeOfChangeOfTrialLocation(
          applicationContext,
          {
            caseEntity,
            newPdfDoc,
            newTrialSessionEntity: updatedTrialSessionEntity,
            previousTrialSession: currentTrialSession,
          },
          authorizedUser,
        );
    }

    caseEntity.updateTrialSessionInformation(updatedTrialSessionEntity);

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity,
    });

    return newPdfDoc;
  });

  const casePdfDocuments = await Promise.all(TASKS);
  const paperServicePdfsCombined = await applicationContext
    .getUtilities()
    .combineAllPdfDocuments(applicationContext, casePdfDocuments);

  const updatedHearingPromises = calendaredCaseEntities.map(async aCase => {
    const matchingHearing = aCase.hearings.find(
      hearing =>
        hearing.trialSessionId == updatedTrialSessionEntity.trialSessionId,
    );

    if (matchingHearing) {
      await applicationContext.getPersistenceGateway().updateCaseHearing({
        applicationContext,
        docketNumber: aCase.docketNumber,
        hearingToUpdate: updatedTrialSessionEntity.validate().toRawObject(),
      });
    }
  });

  await Promise.all(updatedHearingPromises);
  return paperServicePdfsCombined;
};

type CreateWorkingCopyForNewUserOnSessionParams = {
  applicationContext: ServerApplicationContext;
  trialSessionId: string | undefined;
  userId: string | undefined;
};

export const createWorkingCopyForNewUserOnSession = async ({
  applicationContext,
  trialSessionId,
  userId,
}: CreateWorkingCopyForNewUserOnSessionParams) => {
  const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
    trialSessionId,
    userId,
  });

  await applicationContext
    .getPersistenceGateway()
    .createTrialSessionWorkingCopy({
      applicationContext,
      trialSessionWorkingCopy: trialSessionWorkingCopyEntity
        .validate()
        .toRawObject(),
    });
};

export const getPaperServicePdfName = ({
  shouldIssueNoticeOfChangeOfTrialJudge,
  shouldSetNoticeOfChangeToInPersonProceeding,
  shouldSetNoticeOfChangeToRemoteProceeding,
  shouldSetNoticeOfTrialSessionLocationChange,
}: {
  shouldSetNoticeOfChangeToRemoteProceeding: boolean;
  shouldSetNoticeOfChangeToInPersonProceeding: boolean;
  shouldIssueNoticeOfChangeOfTrialJudge: boolean;
  shouldSetNoticeOfTrialSessionLocationChange: boolean;
}): string => {
  if (shouldIssueNoticeOfChangeOfTrialJudge) {
    return 'Notice of Change of Trial Judge';
  } else if (shouldSetNoticeOfChangeToInPersonProceeding) {
    return 'Notice of Change to In Person Proceeding';
  } else if (shouldSetNoticeOfChangeToRemoteProceeding) {
    return 'Notice of Change to Remote Proceeding';
  } else if (shouldSetNoticeOfTrialSessionLocationChange) {
    return 'Notice of Change of Trial Location';
  } else {
    return 'Notice of Change';
  }
};

export function shouldGenerateNoticeOfChangeToRemoteProceeding(
  currentTrialSession: RawTrialSession,
  updatedTrialSessionEntity: RawTrialSession,
): boolean {
  return (
    currentTrialSession.proceedingType ===
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson &&
    updatedTrialSessionEntity.proceedingType ===
      TRIAL_SESSION_PROCEEDING_TYPES.remote &&
    updatedTrialSessionEntity.isCalendared
  );
}

export function shouldGenerateNoticeOfChangeOfTrialJudge(
  currentTrialSession: RawTrialSession,
  updatedTrialSessionEntity: RawTrialSession,
): boolean {
  return (
    currentTrialSession.isCalendared &&
    !!currentTrialSession.judge &&
    !!updatedTrialSessionEntity.judge &&
    currentTrialSession.judge.userId !== updatedTrialSessionEntity.judge.userId
  );
}

export function shouldGenerateNoticeOfChangeToInPersonProceeding(
  currentTrialSession: RawTrialSession,
  updatedTrialSessionEntity: RawTrialSession,
): boolean {
  return (
    currentTrialSession.proceedingType ===
      TRIAL_SESSION_PROCEEDING_TYPES.remote &&
    updatedTrialSessionEntity.proceedingType ===
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson &&
    updatedTrialSessionEntity.isCalendared
  );
}

export function shouldCreateWorkingCopyForNewJudge(
  currentTrialSession: RawTrialSession,
  updatedTrialSessionEntity: TrialSession,
): boolean {
  return Boolean(
    (!get(currentTrialSession, 'judge.userId') &&
      get(updatedTrialSessionEntity, 'judge.userId')) ||
      (currentTrialSession.judge &&
        updatedTrialSessionEntity.judge &&
        currentTrialSession.judge.userId !==
          updatedTrialSessionEntity.judge.userId),
  );
}

export function shouldCreateWorkingCopyForNewTrialClerk(
  currentTrialSession: RawTrialSession,
  updatedTrialSessionEntity: TrialSession,
): boolean {
  return Boolean(
    (!get(currentTrialSession, 'trialClerk.userId') &&
      get(updatedTrialSessionEntity, 'trialClerk.userId')) ||
      (currentTrialSession.trialClerk &&
        updatedTrialSessionEntity.trialClerk &&
        currentTrialSession.trialClerk.userId !==
          updatedTrialSessionEntity.trialClerk.userId),
  );
}
