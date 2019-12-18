import { filter, map, orderBy, partition } from 'lodash';
import { state } from 'cerebral';

export const formatSession = (session, applicationContext) => {
  session.formattedStartDate = applicationContext
    .getUtilities()
    .formatDateString(session.startDate, 'MMDDYY');
  return session;
};

export const formattedDashboardTrialSessions = (get, applicationContext) => {
  const judgeFilterFn = session =>
    session.judge && session.judge.userId === userId;
  const formatSessionFn = session => formatSession(session, applicationContext);
  const partitionFn = session =>
    applicationContext
      .getUtilities()
      .prepareDateFromString(session.startDate)
      .isBefore();

  const { userId } = applicationContext.getCurrentUser();
  const trialSessions = get(state.trialSessions);

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
