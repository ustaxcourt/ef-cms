import { map, orderBy, partition } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const formatSession = (session, applicationContext) => {
  session.formattedStartDate = applicationContext
    .getUtilities()
    .formatDateString(session.startDate, 'MMDDYY');
  return session;
};

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const formattedDashboardTrialSessions = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();

  const formatSessionFn = session => formatSession(session, applicationContext);
  const partitionFn = session =>
    applicationContext
      .getUtilities()
      .prepareDateFromString(session.startDate)
      .isBefore();

  const trialSessions = get(state.trialSessions).filter(session => {
    return session.sessionStatus === SESSION_STATUS_GROUPS.open;
  });

  let [recentSessions, upcomingSessions] = partition(
    trialSessions,
    partitionFn,
  );

  recentSessions = orderBy(recentSessions, ['startDate'], ['desc']);
  upcomingSessions = orderBy(upcomingSessions, ['startDate'], ['asc']);

  recentSessions = map(recentSessions, formatSessionFn);
  upcomingSessions = map(upcomingSessions, formatSessionFn);

  return {
    formattedRecentSessions: recentSessions.slice(0, 5),
    formattedUpcomingSessions: upcomingSessions.slice(0, 5),
  };
};
