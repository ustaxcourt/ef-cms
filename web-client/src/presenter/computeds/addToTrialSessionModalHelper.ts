import { sortBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const formatTrialSessionDisplayOptions = (
  trialSessions,
  applicationContext,
) => {
  return trialSessions.map(trialSession => {
    trialSession.startDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(trialSession.startDate, 'MMDDYY');
    trialSession.optionText = trialSessionOptionText(trialSession);

    return trialSession;
  });
};

export const trialSessionOptionText = (trialSession: {
  trialLocation?: string;
  startDate: string;
  sessionType: string;
}): string => {
  const startDateFormatted = formatDateString(
    trialSession.startDate,
    FORMATS.MMDDYY,
  );
  let sessionTypeFormatted: string = '';
  switch (trialSession.sessionType) {
    case 'Regular':
    case 'Small':
    case 'Hybrid':
      sessionTypeFormatted = trialSession.sessionType.charAt(0);
      break;
    case 'Hybrid-S':
      sessionTypeFormatted = 'HS';
      break;
    case 'Special':
      sessionTypeFormatted = 'SP';
      break;
    case 'Motion/Hearing':
      sessionTypeFormatted = 'M/H';
      break;
  }
  return `${trialSession.trialLocation} ${startDateFormatted} (${sessionTypeFormatted})`;
};

export const trialSessionsModalHelper = ({
  applicationContext,
  excludedTrialSessionIds,
  get,
  trialSessionsFilter,
}) => {
  const caseDetail = get(state.caseDetail);
  const { showAllLocations, trialSessionId, trialSessions } = get(state.modal);
  const { TRIAL_SESSION_SCOPE_TYPES } = applicationContext.getConstants();

  const selectedTrialSession =
    trialSessions &&
    trialSessions.find(session => session.trialSessionId === trialSessionId);

  let trialSessionsFormatted = trialSessions;
  let trialSessionsFormattedByState = null;
  let trialSessionStatesSorted = null;
  const trialSessionRemote = 'Remote';

  if (trialSessionsFormatted) {
    trialSessionsFormatted = formatTrialSessionDisplayOptions(
      trialSessionsFormatted,
      applicationContext,
    );

    if (trialSessionsFilter) {
      trialSessionsFormatted =
        trialSessionsFormatted.filter(trialSessionsFilter);
    }

    if (excludedTrialSessionIds) {
      trialSessionsFormatted = trialSessionsFormatted.filter(
        trialSession =>
          !excludedTrialSessionIds.includes(trialSession.trialSessionId),
      );
    }

    if (showAllLocations) {
      trialSessionsFormatted.forEach(trialSession => {
        if (
          trialSession.sessionScope !==
          TRIAL_SESSION_SCOPE_TYPES.standaloneRemote
        ) {
          trialSession.trialLocationState =
            trialSession.trialLocation.split(', ')[1];
        } else {
          trialSession.trialLocationState = trialSessionRemote;
        }
      });

      trialSessionsFormattedByState = {};
      trialSessionsFormatted.forEach(
        trialSession =>
          (trialSessionsFormattedByState[trialSession.trialLocationState] = [
            ...(trialSessionsFormattedByState[
              trialSession.trialLocationState
            ] || []),
            trialSession,
          ]),
      );

      trialSessionStatesSorted = Object.keys(trialSessionsFormattedByState)
        // sort alpha, but then always keep remote at the top!
        .sort()
        .sort(a => {
          if (a === trialSessionRemote) {
            return -1;
          }
          return 0;
        });

      trialSessionStatesSorted.forEach(stateName => {
        trialSessionsFormattedByState[stateName] = sortBy(
          trialSessionsFormattedByState[stateName],
          ['trialLocation', 'startDate'],
        );
      });
      trialSessionsFormatted = null;
    } else {
      trialSessionsFormatted = trialSessionsFormatted.filter(
        trialSession =>
          trialSession.trialLocation === caseDetail.preferredTrialCity,
      );
      trialSessionsFormatted = sortBy(trialSessionsFormatted, 'startDate');
    }
  }

  return {
    showSessionNotSetAlert: !!(
      selectedTrialSession && selectedTrialSession.isCalendared === false
    ),
    trialSessionStatesSorted,
    trialSessionsFormatted,
    trialSessionsFormattedByState,
  };
};

import { ClientApplicationContext } from '@web-client/applicationContext';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { Get } from 'cerebral';
export const addToTrialSessionModalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();
  const trialSessionsFilter = trialSession =>
    [SESSION_STATUS_GROUPS.new, SESSION_STATUS_GROUPS.open].includes(
      trialSession.sessionStatus,
    );

  const hearings = get(state.caseDetail.hearings);
  const hearingSessionIds = hearings.map(hearing => hearing.trialSessionId);

  let { trialSessionsFormatted, ...helperProps } = trialSessionsModalHelper({
    applicationContext,
    excludedTrialSessionIds: hearingSessionIds,
    get,
    trialSessionsFilter,
  });

  if (trialSessionsFormatted) {
    trialSessionsFormatted = trialSessionsFormatted.filter(trialSession =>
      [SESSION_STATUS_GROUPS.new, SESSION_STATUS_GROUPS.open].includes(
        trialSession.sessionStatus,
      ),
    );
  }

  return {
    ...helperProps,
    trialSessionsFormatted,
  };
};
