import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { JudgeActivityReportSearch } from '../../../../../shared/src/business/entities/judgeActivityReport/JudgeActivityReportSearch';
import { JudgeActivityStatisticsRequest } from '@web-api/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
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
  applicationContext: ServerApplicationContext,
  { endDate, judgeIds, startDate }: JudgeActivityStatisticsRequest,
  authorizedUser: UnknownAuthUser,
): Promise<TrialSessionReturnType> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch({
    endDate,
    judgeIds,
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
    if (!session.judge) {
      return false;
    }
    return searchEntity.judgeIds.includes(session.judge.userId);
  });

  const formattedSearchStartDate = formatDateString(
    searchEntity.startDate,
    FORMATS.ISO,
  );
  const formattedSearchEndDate = formatDateString(
    searchEntity.endDate,
    FORMATS.ISO,
  );
  const judgeSessionsInDateRange = trialSessionsForSelectedJudges.filter(
    session => {
      const formattedSessionStartDate = formatDateString(
        session.startDate,
        FORMATS.ISO,
      );
      return (
        formattedSessionStartDate <= formattedSearchEndDate &&
        formattedSessionStartDate >= formattedSearchStartDate
      );
    },
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
