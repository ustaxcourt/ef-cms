import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';

export type PublicTrialSessionsHelperResults = {
  fetchedDateString: string;
};

export const publicTrialSessionsHelper = (
  get: Get,
): PublicTrialSessionsHelperResults => {
  const fetchedTrialSessions = get(state['FetchedTrialSessions']);
  const fetchedDateString = fetchedTrialSessions.toFormat(
    "MM/dd/yy hh:mm a 'Eastern'",
  );

  return {
    fetchedDateString,
  };
};
