import { find, orderBy } from 'lodash';
import { state } from 'cerebral';

export const formatSession = (session, applicationContext) => {
  session.startOfWeek = applicationContext
    .getUtilities()
    .prepareDateFromString(session.startDate)
    .startOf('isoWeek')
    .format('MMMM D, YYYY');
  session.formattedStartDate = applicationContext
    .getUtilities()
    .formatDateString(session.startDate, 'MMDDYY');
  return session;
};

export const sessionSorter = sessionList => {
  return orderBy(sessionList, ['startDate', 'trialLocation'], ['asc', 'asc']);
};

export const formattedTrialSessions = (get, applicationContext) => {
  const sessions = orderBy(get(state.trialSessions), 'startDate');

  const formattedSessions = [];
  sessions.forEach(session => {
    const formattedSession = formatSession(session, applicationContext);
    let match = find(formattedSessions, {
      dateFormatted: formattedSession.startOfWeek,
    });

    if (!match) {
      match = { dateFormatted: formattedSession.startOfWeek, sessions: [] };
      formattedSessions.push(match);
    }
    match.sessions.push(session);
  });
  formattedSessions.forEach(
    week => (week.sessions = sessionSorter(week.sessions)),
  );

  const selectedTerm = get(state.form.term);
  const selectedTermYear = get(state.form.termYear);
  let sessionsByTerm = [];
  if (selectedTerm) {
    sessionsByTerm = orderBy(
      sessions.filter(
        session =>
          session.term === selectedTerm && session.termYear == selectedTermYear,
      ),
      'trialLocation',
    );
  }
  const showSwingSessionList = get(state.form.swingSession);

  return {
    formattedSessions,
    sessionsByTerm,
    showSwingSessionList,
    showSwingSessionOption: sessionsByTerm.length > 0,
  };
};
