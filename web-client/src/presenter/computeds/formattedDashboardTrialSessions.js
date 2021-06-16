import { filter, map, orderBy, partition } from 'lodash';
import { state } from 'cerebral';

export const formatSession = (session, applicationContext) => {
  session.formattedStartDate = applicationContext
    .getUtilities()
    .formatDateString(session.startDate, 'MMDDYY');
  return session;
};

export const formattedDashboardTrialSessions = (get, applicationContext) => {
  const { role, userId } = applicationContext.getCurrentUser();
  const { SESSION_STATUS_GROUPS, USER_ROLES } =
    applicationContext.getConstants();
  const chambersJudgeUser = get(state.judgeUser);
  const isChambersUser = role === USER_ROLES.chambers;
  const judgeUserId =
    isChambersUser && chambersJudgeUser ? chambersJudgeUser.userId : userId;

  const judgeFilterFn = session =>
    session.judge && session.judge.userId === judgeUserId;
  const formatSessionFn = session => formatSession(session, applicationContext);
  const partitionFn = session =>
    applicationContext
      .getUtilities()
      .prepareDateFromString(session.startDate)
      .isBefore();

  const trialSessions = get(state.trialSessions).filter(session => {
    return (
      applicationContext
        .getUtilities()
        .getTrialSessionStatus({ applicationContext, session }) ===
      SESSION_STATUS_GROUPS.open
    );
  });

  //partition
  let [recentSessions, upcomingSessions] = partition(
    trialSessions,
    partitionFn,
  );

  //sort
  recentSessions = orderBy(recentSessions, ['startDate'], ['desc']);
  upcomingSessions = orderBy(upcomingSessions, ['startDate'], ['asc']);

  //filter by judge
  recentSessions = filter(recentSessions, judgeFilterFn);
  upcomingSessions = filter(upcomingSessions, judgeFilterFn);

  //format sessions
  recentSessions = map(recentSessions, formatSessionFn);
  upcomingSessions = map(upcomingSessions, formatSessionFn);

  return {
    formattedRecentSessions: recentSessions.slice(0, 5),
    formattedUpcomingSessions: upcomingSessions.slice(0, 5),
  };
};
