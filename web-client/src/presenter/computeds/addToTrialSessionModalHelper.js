import { isEmpty, isEqual, sortBy } from 'lodash';
import { state } from 'cerebral';

const formatTrialSessionsForHelper = (trialSessions, applicationContext) => {
  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();

  return trialSessions.map(trialSession => {
    trialSession.startDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(trialSession.startDate, 'MMDDYY');
    switch (trialSession.sessionType) {
      case 'Regular':
      case 'Small':
      case 'Hybrid':
        trialSession.sessionTypeFormatted = trialSession.sessionType.charAt(0);
        break;
      case 'Special':
        trialSession.sessionTypeFormatted = 'SP';
        break;
      case 'Motion/Hearing':
        trialSession.sessionTypeFormatted = 'M/H';
        break;
    }
    trialSession.optionText = `${trialSession.trialLocation} ${trialSession.startDateFormatted} (${trialSession.sessionTypeFormatted})`;

    const allCases = trialSession.caseOrder || [];
    const inactiveCases = allCases.filter(
      sessionCase => sessionCase.removedFromTrial === true,
    );

    if (!isEmpty(allCases) && isEqual(allCases, inactiveCases)) {
      trialSession.computedStatus = SESSION_STATUS_GROUPS.closed;
    } else if (trialSession.isCalendared) {
      trialSession.computedStatus = SESSION_STATUS_GROUPS.open;
    } else {
      trialSession.computedStatus = SESSION_STATUS_GROUPS.new;
    }

    return trialSession;
  });
};

export const trialSessionsModalHelper = ({
  applicationContext,
  excludedTrialSessionIds,
  get,
  trialSessionsFilter,
}) => {
  const caseDetail = get(state.caseDetail);
  const { showAllLocations, trialSessionId, trialSessions } = get(state.modal);

  const selectedTrialSession =
    trialSessions &&
    trialSessions.find(session => session.trialSessionId === trialSessionId);

  let trialSessionsFormatted = trialSessions;
  let trialSessionsFormattedByState = null;
  let trialSessionStatesSorted = null;
  if (trialSessionsFormatted) {
    trialSessionsFormatted = formatTrialSessionsForHelper(
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
      trialSessionsFormatted.forEach(
        trialSession =>
          (trialSession.trialLocationState =
            trialSession.trialLocation.split(', ')[1]),
      );

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

      trialSessionStatesSorted = Object.keys(
        trialSessionsFormattedByState,
      ).sort();

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

export const addToTrialSessionModalHelper = (get, applicationContext) => {
  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();
  const trialSessionsFilter = trialSession =>
    [SESSION_STATUS_GROUPS.new, SESSION_STATUS_GROUPS.open].includes(
      trialSession.computedStatus,
    );

  const hearings = get(state.caseDetail.hearings) || [];
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
        trialSession.computedStatus,
      ),
    );
  }

  return {
    ...helperProps,
    trialSessionsFormatted,
  };
};
