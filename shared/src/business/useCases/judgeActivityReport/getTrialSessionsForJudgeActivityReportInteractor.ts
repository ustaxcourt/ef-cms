import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { JudgeActivityReportFilters } from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
} from '../../entities/EntityConstants';
import { sum } from 'lodash';

export type TrialSessionTypes = {
  [SESSION_TYPES.regular]: number;
  [SESSION_TYPES.small]: number;
  [SESSION_TYPES.hybrid]: number;
  [SESSION_TYPES.special]: number;
  [SESSION_TYPES.motionHearing]: number;
};

export type TrialSessionReturnType = {
  aggregations: TrialSessionTypes;
  total: number;
};

export const getTrialSessionsForJudgeActivityReportInteractor = async (
  applicationContext: IApplicationContext,
  { endDate, judges, startDate }: JudgeActivityReportFilters,
): Promise<TrialSessionReturnType> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch({
    endDate,
    judges,
    startDate,
  });

  if (!searchEntity.isValid()) {
    throw new InvalidRequest(
      'the judge activity report search entity was invalid',
    );
  }

  const trialSessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({
      applicationContext,
    });

  const trialSessionsForSelectedJudges = trialSessions.filter(session => {
    if (judges && session.judge) {
      return searchEntity.judges.includes(session.judge.name);
    } else {
      return true;
    }
  });

  const judgeSessionsInDateRange = trialSessionsForSelectedJudges.filter(
    session =>
      session.startDate <= searchEntity.endDate &&
      session.startDate >= searchEntity.startDate,
  );

  const smallNonSwingSessions = judgeSessionsInDateRange.filter(
    session =>
      isTypeOf(SESSION_TYPES.small)(session) &&
      !isNew(session) &&
      !isSwingSession(session),
  ).length;

  const smallSwingSessions =
    judgeSessionsInDateRange.filter(
      session =>
        isTypeOf(SESSION_TYPES.small)(session) && isSwingSession(session),
    ).length / 2;

  const regularNonSwingSessions = judgeSessionsInDateRange.filter(
    session =>
      isTypeOf(SESSION_TYPES.regular)(session) &&
      !isNew(session) &&
      !isSwingSession(session),
  ).length;

  const regularSwingSessions =
    judgeSessionsInDateRange.filter(
      session =>
        isTypeOf(SESSION_TYPES.regular)(session) &&
        !isNew(session) &&
        isSwingSession(session),
    ).length / 2;

  const hybridNonSwingSessions = judgeSessionsInDateRange.filter(
    session =>
      (isTypeOf(SESSION_TYPES.hybrid)(session) ||
        isTypeOf(SESSION_TYPES.hybridSmall)(session)) &&
      !isNew(session) &&
      !isSwingSession(session),
  ).length;

  const hybridSwingSessions =
    judgeSessionsInDateRange.filter(
      session =>
        (isTypeOf(SESSION_TYPES.hybrid)(session) ||
          isTypeOf(SESSION_TYPES.hybridSmall)(session)) &&
        !isNew(session) &&
        isSwingSession(session),
    ).length / 2;

  const motionHearingSessions =
    judgeSessionsInDateRange.filter(
      session =>
        isTypeOf(SESSION_TYPES.motionHearing)(session) && !isNew(session),
    ).length / 2;

  const specialSessions = judgeSessionsInDateRange.filter(session =>
    isTypeOf(SESSION_TYPES.special)(session),
  ).length;

  const aggregatedSessionTypes = {
    [SESSION_TYPES.regular]: regularSwingSessions + regularNonSwingSessions,
    [SESSION_TYPES.small]: smallNonSwingSessions + smallSwingSessions,
    [SESSION_TYPES.hybrid]: hybridSwingSessions + hybridNonSwingSessions,
    [SESSION_TYPES.special]: specialSessions,
    [SESSION_TYPES.motionHearing]: motionHearingSessions,
  };

  const trialSessionsHeldTotal = sum(Object.values(aggregatedSessionTypes));

  return {
    aggregations: aggregatedSessionTypes,
    total: trialSessionsHeldTotal,
  };
};

const isNew = session => session.sessionStatus === SESSION_STATUS_TYPES.new;
const isTypeOf = sessionType => {
  return session => session.sessionType === sessionType;
};
const isSwingSession = session => session.swingSession;
