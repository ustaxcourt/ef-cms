import { Get } from 'cerebral';
import {
  SESSION_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  TrialSessionRow,
  TrialSessionWeek,
  formatTrialSessions,
  isTrialSessionWeek,
} from '@web-client/presenter/computeds/trialSessionsHelper';
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
    value: string;
  }[];
  filtersHaveBeenModified: boolean;
  totalPages: number;
  trialSessionsCount: number;
  trialSessionRows: (TrialSessionRow | TrialSessionWeek)[];
  groupedTrialsSessions: {
    header: TrialSessionWeek;
    rows: TrialSessionRow[];
  }[];
};

function areAnyFiltersModified(
  proceedingType: string,
  judges: { [key: string]: string },
  locations: { [key: string]: string },
  sessionTypes: { [key: string]: string },
): boolean {
  const proceedingTypeModified = proceedingType !== 'All';
  const judgesModified = Object.values(judges).filter(j => !!j).length;
  const locationsModified = Object.values(locations).filter(l => !!l).length;
  const sessionTypesModified = Object.values(sessionTypes).filter(
    st => !!st,
  ).length;

  return (
    !!proceedingTypeModified ||
    !!judgesModified ||
    !!locationsModified ||
    !!sessionTypesModified
  );
}

function groupTrialSessions(
  trialSessions: (TrialSessionRow | TrialSessionWeek)[],
): { header: TrialSessionWeek; rows: TrialSessionRow[] }[] {
  const groupedTrialSessions: {
    header: TrialSessionWeek;
    rows: TrialSessionRow[];
  }[] = [];

  let counter = -1;
  trialSessions.forEach(tsRow => {
    if (isTrialSessionWeek(tsRow)) {
      groupedTrialSessions.push({
        header: tsRow,
        rows: [] as TrialSessionRow[],
      });
      counter += 1;
    } else {
      groupedTrialSessions[counter].rows.push(tsRow);
    }
  });

  return groupedTrialSessions;
}

const PAGE_SIZE = 100;

export const publicTrialSessionsHelper = (
  get: Get,
): PublicTrialSessionsHelperResults => {
  const fetchedTrialSessions = get(state['FetchedTrialSessions']);
  const trialSessionJudges = get(state.judges) || [];
  const {
    judges = {},
    locations = {},
    pageNumber = 0,
    proceedingType = 'All',
    sessionTypes = {},
  } = get(state.publicTrialSessionData);

  const trialSessions = get(state.trialSessionsPage.trialSessions) || [];
  const fetchedDateString = fetchedTrialSessions.toFormat(
    "MM/dd/yy hh:mm a 'Eastern'",
  );

  const sessionTypeOptions = Object.values(SESSION_TYPES).map(sessionType => ({
    label: sessionType,
    value: sessionType,
  }));

  const standaloneRemoteOption = {
    label: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
    options: [
      {
        label: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
        value: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      },
    ],
  };
  const trialCitiesByState = [
    standaloneRemoteOption,
    ...getTrialCitiesGroupedByState(),
  ];

  const trialSessionJudgeOptions = trialSessionJudges.map(
    trialSessionJudge => ({
      label: trialSessionJudge.name,
      value: trialSessionJudge.name,
    }),
  );

  const filtersHaveBeenModified = areAnyFiltersModified(
    proceedingType,
    judges,
    locations,
    sessionTypes,
  );

  const filteredTrialSessions = trialSessions
    .filter(
      ts => proceedingType === 'All' || ts.proceedingType === proceedingType,
    )
    .filter(ts => !Object.entries(judges).length || judges[ts.judge?.name!])
    .filter(
      ts => !Object.entries(locations).length || locations[ts.trialLocation!],
    )
    .filter(
      ts =>
        !Object.entries(sessionTypes).length || sessionTypes[ts.sessionType!],
    )
    .sort((sessionA, sessionB) => {
      return sessionA.startDate.localeCompare(sessionB.startDate);
    });

  const paginatedTrialSessions = filteredTrialSessions.slice(
    pageNumber * PAGE_SIZE,
    pageNumber * PAGE_SIZE + PAGE_SIZE,
  );

  const trialSessionRows = formatTrialSessions({
    trialSessions: paginatedTrialSessions,
  });

  const groupedTrialsSessions = groupTrialSessions(trialSessionRows);

  return {
    fetchedDateString,
    filtersHaveBeenModified,
    groupedTrialsSessions,
    sessionTypeOptions,
    totalPages: Math.ceil(filteredTrialSessions.length / PAGE_SIZE),
    trialCitiesByState,
    trialSessionJudgeOptions,
    trialSessionRows,
    trialSessionsCount: filteredTrialSessions.length,
  };
};
