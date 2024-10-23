import { Get } from 'cerebral';
import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { getTrialCitiesGroupedByState } from '@shared/business/utilities/trialSession/trialCitiesGroupedByState';
import { state } from '@web-client/presenter/app-public.cerebral';

export type PublicTrialSessionsHelperResults = {
  fetchedDateString: string;
  sessionTypeOptions: {
    label: string;
    value: string;
  }[];
  trialCitiesByState: {
    label: string;
    options: { label: string; value: string }[];
  }[];
  trialSessionJudgeOptions: {
    label: string;
    value: {
      name: string;
      userId: string;
    };
  }[];
};

export const publicTrialSessionsHelper = (
  get: Get,
): PublicTrialSessionsHelperResults => {
  const fetchedTrialSessions = get(state['FetchedTrialSessions']);
  const trialSessionJudges = get(state.judges) || [];

  const fetchedDateString = fetchedTrialSessions.toFormat(
    "MM/dd/yy hh:mm a 'Eastern'",
  );

  const sessionTypeOptions = Object.values(SESSION_TYPES).map(sessionType => ({
    label: sessionType,
    value: sessionType,
  }));

  const trialCitiesByState = getTrialCitiesGroupedByState();

  const trialSessionJudgeOptions = trialSessionJudges.map(
    trialSessionJudge => ({
      label: trialSessionJudge.name,
      value: { name: trialSessionJudge.name, userId: trialSessionJudge.userId },
    }),
  );

  return {
    fetchedDateString,
    sessionTypeOptions,
    trialCitiesByState,
    trialSessionJudgeOptions,
  };
};
