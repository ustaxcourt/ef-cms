import { state } from 'cerebral';
import _ from 'lodash';

const formatSession = (session, applicationContext) => {
  session.startOfWeek = applicationContext
    .getUtilities()
    .prepareDateFromString(session.startDate)
    .startOf('isoWeek')
    .format('MMMM D, YYYY');
  session.startDate = applicationContext
    .getUtilities()
    .formatDateString(session.startDate, 'MMDDYY');
  return session;
};

export const formattedTrialSessions = (get, applicationContext) => {
  const sessions = _.orderBy(
    get(state.trialSessions),
    ['startDate', 'swingSession'],
    ['asc', 'desc'],
  );

  const formattedSessions = [];
  sessions.forEach(session => {
    const formattedSession = formatSession(session, applicationContext);
    let match = _.find(formattedSessions, {
      dateFormatted: formattedSession.startOfWeek,
    });

    if (!match) {
      match = { dateFormatted: formattedSession.startOfWeek, sessions: [] };
      formattedSessions.push(match);
    }
    match.sessions.push(session);
  });
  return formattedSessions;
};
