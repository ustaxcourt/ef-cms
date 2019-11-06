import { filter, find, identity, orderBy, pickBy } from 'lodash';
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
  const judgeUser = get(state.judgeUser);
  const orderedSessions = orderBy(get(state.trialSessions), 'startDate');

  // filter trial sessions
  const trialSessionFilters = pickBy(
    get(state.screenMetadata.trialSessionFilters),
    identity,
  );

  const judgeFilter = get(
    state.screenMetadata.trialSessionFilters.judge.userId,
  );
  if (!judgeFilter) {
    delete trialSessionFilters.judge;
  }

  const sessions = filter(orderedSessions, trialSessionFilters);

  const formattedSessions = [];
  sessions.forEach(session => {
    if (
      session.judge &&
      judgeUser &&
      session.judge.userId === judgeUser.userId
    ) {
      session.userIsAssignedToSession = true;
    } else {
      session.userIsAssignedToSession = false;
    }

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
