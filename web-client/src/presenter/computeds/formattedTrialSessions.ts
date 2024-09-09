import { Get } from 'cerebral';
import { SESSION_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { state } from '@web-client/presenter/app.cerebral';
import { trialSessionOptionText } from './addToTrialSessionModalHelper';

// export const formatSession = (session, applicationContext) => {
//   const { DATE_FORMATS } = applicationContext.getConstants();

//   session.startOfWeek = createDateAtStartOfWeekEST(
//     session.startDate,
//     DATE_FORMATS.MONTH_DAY_YEAR,
//   );

//   session.startOfWeekSortable = createDateAtStartOfWeekEST(
//     session.startDate,
//     DATE_FORMATS.YYYYMMDD_NUMERIC,
//   );

//   session.formattedStartDate = applicationContext
//     .getUtilities()
//     .formatDateString(session.startDate, DATE_FORMATS.MMDDYY);

//   session.formattedEstimatedEndDate = applicationContext
//     .getUtilities()
//     .formatDateString(session.estimatedEndDate, DATE_FORMATS.MMDDYY);

//   session.formattedNoticeIssuedDate = applicationContext
//     .getUtilities()
//     .formatDateString(session.noticeIssuedDate, DATE_FORMATS.MMDDYYYY);

//   session.showAlertForNOTTReminder =
//     !session.dismissedAlertForNOTT &&
//     session.isStartDateWithinNOTTReminderRange;

//   if (session.showAlertForNOTTReminder) {
//     session.alertMessageForNOTT = `The 30-day notice is due by ${session.thirtyDaysBeforeTrialFormatted}`;
//   }

//   return session;
// };

// export const sessionSorter = (sessionList, dateSort = 'asc') => {
//   return orderBy(
//     sessionList,
//     ['startDate', 'trialLocation'],
//     [dateSort, 'asc'],
//   );
// };

// export const filterFormattedSessionsByStatus = trialTerms => {
//   const sessionSort = {
//     All: 'desc',
//     Closed: 'desc',
//     New: 'asc',
//     Open: 'asc',
//   };

//   const filteredbyStatusType = {
//     All: [],
//     Closed: [],
//     New: [],
//     Open: [],
//   };

//   const initTermIndex = (trialTerm, filtered) => {
//     let termIndex = filtered.findIndex(
//       term => term.dateFormatted === trialTerm.dateFormatted,
//     );

//     if (termIndex === -1) {
//       filtered.push({
//         dateFormatted: trialTerm.dateFormatted,
//         sessions: [],
//         startOfWeekSortable: trialTerm.startOfWeekSortable,
//       });
//       termIndex = filtered.length - 1;
//     }

//     return termIndex;
//   };

//   trialTerms.forEach(trialTerm => {
//     trialTerm.sessions.forEach(session => {
//       const termIndex = initTermIndex(
//         trialTerm,
//         filteredbyStatusType[session.sessionStatus],
//       );

//       if (!session.judge) {
//         session.judge = {
//           name: 'Unassigned',
//           userId: 'unassigned',
//         };
//       }
//       // Add session status to filtered session
//       filteredbyStatusType[session.sessionStatus][termIndex].sessions.push(
//         session,
//       );

//       // Push to all
//       const allTermIndex = initTermIndex(trialTerm, filteredbyStatusType.All);
//       filteredbyStatusType.All[allTermIndex].sessions.push(session);
//     });
//   });

//   for (let [status, entryTrialTerms] of Object.entries(filteredbyStatusType)) {
//     filteredbyStatusType[status] = orderBy(
//       entryTrialTerms,
//       ['startOfWeekSortable'],
//       [sessionSort[status]],
//     );
//     entryTrialTerms.forEach(trialTerm => {
//       trialTerm.sessions = sessionSorter(trialTerm.sessions, [
//         sessionSort[status],
//       ]);
//     });
//   }

//   return filteredbyStatusType;
// };

// const sortSessionsByTerm = ({
//   applicationContext,
//   currentTrialSessionId,
//   selectedTerm,
//   selectedTermYear,
//   sessions,
// }: {
//   applicationContext: ClientApplicationContext;
//   selectedTermYear: string;
//   selectedTerm: string;
//   sessions: RawTrialSession[];
//   currentTrialSessionId?: string;
// }) => {
//   const sessionsByTermOrderedByTrialLocation = orderBy(
//     sessions.filter(
//       session =>
//         session.term === selectedTerm && session.termYear == selectedTermYear,
//     ),
//     'trialLocation',
//   );

//   const sessionsGroupedByTrialLocation = groupBy(
//     sessionsByTermOrderedByTrialLocation,
//     'trialLocation',
//   );

//   const sessionsOrderedChronologically = flatMap(
//     sessionsGroupedByTrialLocation,
//     group => {
//       return orderBy(group, 'startDate', 'asc');
//     },
//   );

//   const sessionsByTermFormatted = formatTrialSessionDisplayOptions(
//     sessionsOrderedChronologically,
//     applicationContext,
//   );

//   if (currentTrialSessionId) {
//     return sessionsByTermFormatted.filter(
//       session => session.trialSessionId !== currentTrialSessionId,
//     );
//   }

//   return sessionsByTermFormatted;
// };

export const formattedTrialSessions = (
  get: Get,
): {
  swingSessions: { trialSessionId: string; swingSessionText: string }[];
  showSwingSessionList: boolean;
  showSwingSessionOption: boolean;
} => {
  const trialSessions: TrialSessionInfoDTO[] = get(state.trialSessions) || [];
  const selectedTerm = get(state.form.term);
  const selectedTermYear = get(state.form.termYear);
  const currentTrialSessionId = get(state.trialSession.trialSessionId);

  const validSwingSessions: {
    trialSessionId: string;
    swingSessionText: string;
  }[] = trialSessions
    .filter(trialSession => trialSession.termYear === selectedTermYear)
    .filter(trialSession => trialSession.term === selectedTerm)
    .filter(
      trialSession =>
        trialSession.sessionStatus !== SESSION_STATUS_TYPES.closed,
    )
    .filter(
      trialSession => trialSession.trialSessionId !== currentTrialSessionId,
    )
    .sort((sessionA, sessionB) => {
      const aTrialLocation = sessionA.trialLocation || '';
      const bTrialLocation = sessionA.trialLocation || '';
      if (aTrialLocation === bTrialLocation) {
        return sessionA.startDate.localeCompare(sessionB.startDate);
      }
      return aTrialLocation.localeCompare(bTrialLocation);
    })
    .map(trialSession => {
      const swingSessionText = trialSessionOptionText(trialSession);
      return {
        swingSessionText,
        trialSessionId: trialSession.trialSessionId || '',
      };
    });

  // const judgeId = get(state.judgeUser.userId);
  // const currentTrialSessionId = get(state.trialSession.trialSessionId);
  // const currentUser = get(state.user);

  // const trialSessionFilters = pickBy(
  //   omit(get(state.screenMetadata.trialSessionFilters), 'status'),
  //   identity,
  // );
  // const judgeFilter = get(
  //   state.screenMetadata.trialSessionFilters.judge.userId,
  // );

  // const tab = get(state.currentViewMetadata.trialSessions.tab);

  // if (!judgeFilter || (tab !== 'new' && judgeFilter === 'unassigned')) {
  //   delete trialSessionFilters.judge;
  // }

  // const sessions = filter(get(state.trialSessions), trialSessionFilters);

  // const formattedSessions = [];
  // sessions.forEach(session => {
  //   const isJudgeUserAssigned = !!(
  //     session.judge?.userId === judgeId && judgeId
  //   );
  //   const isTrialClerkUserAssigned =
  //     session.trialClerk?.userId === currentUser.userId;

  //   session.userIsAssignedToSession =
  //     isJudgeUserAssigned || isTrialClerkUserAssigned;

  //   const formattedSession = formatSession(session, applicationContext);

  //   let sessionWeek = find(formattedSessions, {
  //     startOfWeekSortable: formattedSession.startOfWeekSortable,
  //   });

  //   if (!sessionWeek) {
  //     sessionWeek = {
  //       dateFormatted: formattedSession.startOfWeek,
  //       sessions: [],
  //       startOfWeekSortable: formattedSession.startOfWeekSortable,
  //     };
  //     formattedSessions.push(sessionWeek);
  //   }
  //   sessionWeek.sessions.push(session);
  // });

  // formattedSessions.forEach(
  //   week => (week.sessions = sessionSorter(week.sessions)),
  // );

  // const selectedTerm = get(state.form.term);
  // let sessionsByTerm: any[] = [];

  // if (selectedTerm) {
  //   const selectedTermYear = get(state.form.termYear);
  //   sessionsByTerm = sortSessionsByTerm({
  //     applicationContext,
  //     currentTrialSessionId,
  //     selectedTerm,
  //     selectedTermYear,
  //     sessions,
  //   });
  // }

  return {
    showSwingSessionList: get(state.form.swingSession),
    showSwingSessionOption: validSwingSessions.length > 0,
    swingSessions: validSwingSessions,
  };
};
