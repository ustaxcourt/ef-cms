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
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { createTrialSessionWorkingCopy } from '@web-api/persistence/postgres/trialSessions/createTrialSessionWorkingCopy';

type GetCasesInTrialSessionParams = {
  trialSession: RawTrialSession;
  authorizedUser: AuthUser;
  includeHearings?: boolean;
};

export async function getCasesInTrialSession({
  trialSession,
  authorizedUser,
  includeHearings = false,
}: GetCasesInTrialSessionParams): Promise<{
  calendaredCaseEntities: Case[];
  casesThatShouldReceiveNotices: Case[];
}> {
  const docketNumbers = trialSession
    .caseOrder!.filter(c => !c.removedFromTrial)
    .map(c => c.docketNumber);
  const rawCases = await getCasesByDocketNumbers({ docketNumbers });
  const calendaredCaseEntities = rawCases.map(aCase => {
    return new Case(aCase, { authorizedUser });
  });

  const casesThatShouldReceiveNotices = calendaredCaseEntities
    .filter(aCase => !aCase.isClosed())
    .filter(
      aCase =>
        includeHearings || aCase.trialSessionId === trialSession.trialSessionId,
    );

  return { calendaredCaseEntities, casesThatShouldReceiveNotices };
}

type UpdateCasesAndSetNoticeOfChangeParams = {
  applicationContext: ServerApplicationContext;
  currentTrialSession: RawTrialSession;
  updatedTrialSessionEntity: TrialSession;
  authorizedUser: AuthUser;
  shouldSetNoticeOfChangeToRemoteProceeding: boolean;
  shouldSetNoticeOfTrialSessionLocationChange: boolean;
  shouldSetNoticeOfTrialSessionStartDateChange: boolean;
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
  shouldSetNoticeOfTrialSessionStartDateChange,
  updatedTrialSessionEntity,
}: UpdateCasesAndSetNoticeOfChangeParams): Promise<{
  paperServicePdfsCombined: PDFDocumentType;
  updatedCasesToSave: Case[];
  sendEmailCalls: (() => Promise<void>)[];
}> => {
  const { casesThatShouldReceiveNotices } = await getCasesInTrialSession({
    trialSession: currentTrialSession,
    includeHearings: true,
    authorizedUser,
  });

  const updatedCasesToSave: Case[] = [];
  const sendEmailCalls: (() => Promise<void>)[] = [];

  const TASKS = casesThatShouldReceiveNotices.map(async (caseEntity: Case) => {
    const { PDFDocument } = await applicationContext.getPdfLib();
    const newPdfDoc = await PDFDocument.create();

    if (shouldSetNoticeOfChangeToRemoteProceeding) {
      sendEmailCalls.push(
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
          ),
      );
    }

    if (shouldSetNoticeOfChangeToInPersonProceeding) {
      sendEmailCalls.push(
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
          ),
      );
    }

    if (shouldIssueNoticeOfChangeOfTrialJudge) {
      sendEmailCalls.push(
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
          ),
      );
    }

    if (shouldSetNoticeOfTrialSessionLocationChange) {
      sendEmailCalls.push(
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
          ),
      );
    }

    if (shouldSetNoticeOfTrialSessionStartDateChange) {
      sendEmailCalls.push(
        await applicationContext
          .getUseCaseHelpers()
          .setNoticeOfChangeOfTrialStartDate(
            applicationContext,
            {
              caseEntity,
              newPdfDoc,
              newTrialSessionEntity: updatedTrialSessionEntity,
              previousTrialSession: currentTrialSession,
            },
            authorizedUser,
          ),
      );
    }

    if (
      caseEntity.trialSessionId === updatedTrialSessionEntity.trialSessionId
    ) {
      caseEntity.updateTrialSessionInformation(updatedTrialSessionEntity);
    }

    updatedCasesToSave.push(caseEntity);

    return newPdfDoc;
  });

  const casePdfDocuments = await settlePromises(TASKS);
  const paperServicePdfsCombined = await applicationContext
    .getUtilities()
    .combineAllPdfDocuments(applicationContext, casePdfDocuments);

  return { paperServicePdfsCombined, updatedCasesToSave, sendEmailCalls };
};

type CreateWorkingCopyForNewUserOnSessionParams = {
  trialSessionId: string | undefined;
  userId: string | undefined;
};

export const createWorkingCopyForNewUserOnSession = async ({
  trialSessionId,
  userId,
}: CreateWorkingCopyForNewUserOnSessionParams) => {
  const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
    trialSessionId,
    userId,
  });

  await createTrialSessionWorkingCopy({
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
  shouldSetNoticeOfTrialSessionStartDateChange,
}: {
  shouldSetNoticeOfChangeToRemoteProceeding: boolean;
  shouldSetNoticeOfChangeToInPersonProceeding: boolean;
  shouldIssueNoticeOfChangeOfTrialJudge: boolean;
  shouldSetNoticeOfTrialSessionLocationChange: boolean;
  shouldSetNoticeOfTrialSessionStartDateChange: boolean;
}): string => {
  if (shouldIssueNoticeOfChangeOfTrialJudge) {
    return 'Notice of Change of Trial Judge';
  } else if (shouldSetNoticeOfChangeToInPersonProceeding) {
    return 'Notice of Change to In Person Proceeding';
  } else if (shouldSetNoticeOfChangeToRemoteProceeding) {
    return 'Notice of Change to Remote Proceeding';
  } else if (shouldSetNoticeOfTrialSessionLocationChange) {
    return 'Notice of Change of Trial Location';
  } else if (shouldSetNoticeOfTrialSessionStartDateChange) {
    return 'Notice of Change of Trial Date';
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
