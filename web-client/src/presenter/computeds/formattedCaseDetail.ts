import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { setServiceIndicatorsForPetitionersOnCase } from '@shared/business/utilities/setServiceIndicatorsForPetitionersOnCase';
import { state } from '@web-client/presenter/app.cerebral';
import { type FormattedCase } from '@shared/business/utilities/getFormattedCaseDetail';

type tPetitioner = TPetitioner & {
  contactId: string;
  displayName: string;
  isCurrentUser: boolean;
};
export type ComputedFormattedCaseDetail = Omit<
  FormattedCase,
  'petitioners' | 'consolidatedCases'
> & {
  consolidatedCases: FormattedCase[];
  petitioners: tPetitioner[];
  trialSessionNotes?: string;
  userIsAssignedToSession?: boolean;
};

export const formattedOpenCases = (
  get: Get,
  applicationContext: ClientApplicationContext,
): FormattedCase[] => {
  const { formatCase } = applicationContext.getUtilities();

  const cases = get(state.openCases);
  const user = get(state.user);

  return cases.map(myCase => formatCase(applicationContext, myCase, user));
};

export const formattedClosedCases = (
  get: Get,
  applicationContext: ClientApplicationContext,
): FormattedCase[] => {
  const { formatCase } = applicationContext.getUtilities();
  const user = get(state.user);

  const cases = get(state.closedCases);
  return cases.map(myCase => formatCase(applicationContext, myCase, user));
};

export const getUserIsAssignedToSession = ({
  currentUser,
  get,
  trialSessionId,
}): boolean => {
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

export const formattedCaseDetail = (
  get: Get,
  applicationContext: ClientApplicationContext,
): ComputedFormattedCaseDetail => {
  const { formatCase } = applicationContext.getUtilities();

  const caseDetail = get(state.caseDetail);
  const user = get(state.user);

  const formattedCase = formatCase(applicationContext, caseDetail, user);

  const petitioners: tPetitioner[] = applicationContext
    .getUtilities()
    .getFormattedPartiesNameAndTitle({ petitioners: formattedCase.petitioners })
    ?.map((petitioner: TPetitioner & { displayName: string }) => ({
      ...petitioner,
      isCurrentUser: petitioner.contactId === user.userId,
    }));

  const consolidatedCases =
    formattedCase.consolidatedCases.map(c =>
      formatCase(applicationContext, c, user),
    ) || [];

  const allTrialSessions = get(state.trialSessions);

  const { note: trialSessionNotes } = getCalendarDetailsForTrialSession({
    caseDocketNumber: caseDetail.docketNumber,
    trialSessionId: caseDetail.trialSessionId,
    trialSessions: allTrialSessions,
  });

  if (formattedCase.hearings && formattedCase.hearings.length) {
    formattedCase.hearings.forEach(hearing => {
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

    formattedCase.hearings.sort((a, b) => {
      return applicationContext
        .getUtilities()
        .compareISODateStrings(a.addedToSessionAt, b.addedToSessionAt);
    });
  }

  const userIsAssignedToSession = getUserIsAssignedToSession({
    currentUser: user,
    get,
    trialSessionId: caseDetail.trialSessionId,
  });

  return {
    ...setServiceIndicatorsForPetitionersOnCase(caseDetail),
    ...formattedCase,
    consolidatedCases,
    petitioners,
    trialSessionNotes,
    userIsAssignedToSession,
  };
};
