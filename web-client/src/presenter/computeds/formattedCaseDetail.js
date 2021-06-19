import { state } from 'cerebral';

export const formattedOpenCases = (get, applicationContext) => {
  const { formatCase } = applicationContext.getUtilities();

  const cases = get(state.openCases);
  return cases.map(myCase => formatCase(applicationContext, myCase));
};

export const formattedClosedCases = (get, applicationContext) => {
  const { formatCase } = applicationContext.getUtilities();

  const cases = get(state.closedCases);
  return cases.map(myCase => formatCase(applicationContext, myCase));
};

const getUserIsAssignedToSession = ({ currentUser, get, trialSessionId }) => {
  const sessions = get(state.trialSessions);
  let session;
  if (sessions) {
    session = sessions.find(s => s.trialSessionId === trialSessionId);
  }

  const judge = get(state.judgeUser);

  const isJudgeUserAssigned = session?.judge?.userId === currentUser.userId;
  const isChambersUserAssigned =
    judge &&
    session?.judge?.userId === judge.userId &&
    judge.section === currentUser.section;
  const isTrialClerkUserAssigned =
    session?.trialClerk?.userId === currentUser.userId;

  return !!(
    isJudgeUserAssigned ||
    isTrialClerkUserAssigned ||
    isChambersUserAssigned
  );
};

const getCalendarDetailsForTrialSession = ({
  caseDocketNumber,
  trialSessionId,
  trialSessions,
}) => {
  let note;
  let addedAt;

  if (!trialSessions || !trialSessions.length) {
    return { addedAt, note };
  }

  const foundTrialSession = trialSessions.find(
    session => session.trialSessionId === trialSessionId,
  );

  if (foundTrialSession && foundTrialSession.caseOrder) {
    const trialSessionCase = foundTrialSession.caseOrder.find(
      sessionCase => sessionCase.docketNumber === caseDocketNumber,
    );

    note = trialSessionCase && trialSessionCase.calendarNotes;
    addedAt = trialSessionCase && trialSessionCase.addedToSessionAt;
  }

  return { addedAt, note };
};

export const formattedCaseDetail = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();

  const { formatCase, setServiceIndicatorsForCase } =
    applicationContext.getUtilities();

  const caseDetail = get(state.caseDetail);

  const result = {
    ...setServiceIndicatorsForCase(caseDetail),
    ...formatCase(applicationContext, caseDetail),
  };

  result.petitioners = applicationContext
    .getUtilities()
    .getFormattedPartiesNameAndTitle({ petitioners: result.petitioners });

  result.consolidatedCases = result.consolidatedCases || [];

  const allTrialSessions = get(state.trialSessions);

  const { note: trialSessionNotes } = getCalendarDetailsForTrialSession({
    caseDocketNumber: caseDetail.docketNumber,
    trialSessionId: caseDetail.trialSessionId,
    trialSessions: allTrialSessions,
  });

  result.trialSessionNotes = trialSessionNotes;

  if (result.hearings && result.hearings.length) {
    result.hearings.forEach(hearing => {
      const { addedAt, note } = getCalendarDetailsForTrialSession({
        caseDocketNumber: caseDetail.docketNumber,
        trialSessionId: hearing.trialSessionId,
        trialSessions: allTrialSessions,
      });

      hearing.calendarNotes = note;
      hearing.addedToSessionAt = addedAt;

      hearing.userIsAssignedToSession = getUserIsAssignedToSession({
        currentUser: user,
        get,
        trialSessionId: hearing.trialSessionId,
      });
    });

    result.hearings.sort((a, b) => {
      return applicationContext
        .getUtilities()
        .compareISODateStrings(a.addedToSessionAt, b.addedToSessionAt);
    });
  }

  result.userIsAssignedToSession = getUserIsAssignedToSession({
    currentUser: user,
    get,
    trialSessionId: caseDetail.trialSessionId,
  });

  return result;
};
