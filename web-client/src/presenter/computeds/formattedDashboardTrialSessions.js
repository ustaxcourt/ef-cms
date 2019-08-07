import { filter, orderBy } from 'lodash';
import { state } from 'cerebral';

export const formatSession = (session, applicationContext) => {
  session.formattedStartDate = applicationContext
    .getUtilities()
    .formatDateString(session.startDate, 'MMDDYY');
  return session;
};

export const formattedDashboardTrialSessions = (get, applicationContext) => {
  const user = get(state.user);

  const orderedSessions = orderBy(get(state.trialSessions), 'startDate');

  //filter by judge
  const sessions = filter(
    orderedSessions,
    session => session.judge.userId === user.userId,
  );

  const formattedSessions = [];
  sessions.forEach(session => {
    formattedSessions.push(formatSession(session, applicationContext));
  });

  return {
    formattedSessions,
  };
};
