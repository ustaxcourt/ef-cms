import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportRequestType } from '@web-client/presenter/judgeActivityReportState';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
} from '../../entities/EntityConstants';

export const getTrialSessionsForJudgeActivityReportInteractor = async (
  applicationContext: IApplicationContext,
  { endDate, judgesSelection, startDate }: JudgeActivityReportRequestType,
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch({
    endDate,
    judgesSelection,
    startDate,
  });

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  let totalRegular: number = 0;
  let totalSmall: number = 0;
  let totalHybrid: number = 0;
  let totalSpecial: number = 0;
  let totalMotionHearing: number = 0;

  await Promise.all(
    judgesSelection.map(async judgeId => {
      const trialSessions = await applicationContext
        .getPersistenceGateway()
        .getTrialSessions({
          applicationContext,
        });

      const judgeSessionsInDateRange = trialSessions.filter(
        session =>
          session.judge?.userId === judgeId &&
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

      totalRegular += regularSwingSessions + regularNonSwingSessions;
      totalSmall += smallNonSwingSessions + smallSwingSessions;
      totalHybrid += hybridSwingSessions + hybridNonSwingSessions;
      totalSpecial += specialSessions;
      totalMotionHearing += motionHearingSessions;
    }),
  );

  return {
    [SESSION_TYPES.regular]: totalRegular,
    [SESSION_TYPES.small]: totalSmall,
    [SESSION_TYPES.hybrid]: totalHybrid,
    [SESSION_TYPES.special]: totalSpecial,
    [SESSION_TYPES.motionHearing]: totalMotionHearing,
  };
};

const isNew = session => session.sessionStatus === SESSION_STATUS_TYPES.new;
const isTypeOf = sessionType => {
  return session => session.sessionType === sessionType;
};
const isSwingSession = session => session.swingSession;
