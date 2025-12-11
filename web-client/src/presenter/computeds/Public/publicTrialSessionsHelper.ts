import { Get } from 'cerebral';
import {
  PUBLIC_TRIAL_SESSIONS_DATA_KEY,
  SESSION_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  TrialSessionRow,
  TrialSessionWeek,
  formatTrialSessions,
  isTrialSessionRow,
  isTrialSessionWeek,
} from '@web-client/presenter/computeds/trialSessionsHelper';
import { getTrialCitiesGroupedByState } from '@shared/business/utilities/trialSession/trialCitiesGroupedByState';
import { state } from '@web-client/presenter/app-public.cerebral';
import {
  createISODateAtStartOfDayEST,
  createISODateString,
  dateStringsCompared,
} from '@shared/business/utilities/DateHandler';

export type PublicTrialSessionsHelperResults = {
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
  filteredTrialSessionRows: (TrialSessionRow | TrialSessionWeek)[];
  filteredTrialSessionRowsCount: number;
  publicTrialSessionCount: number;
  mobileFilteredGroups: { header: TrialSessionWeek; rows: TrialSessionRow[] }[];
  mobileTotalPages: number;
};

function areAnyFiltersModified(
  proceedingType: string,
  judges: { [key: string]: string },
  locations: { [key: string]: string },
  sessionTypes: { [key: string]: string },
): boolean {
  const proceedingTypeModified = proceedingType !== 'All';
  const judgesModified = Object.values(judges).some(Boolean);
  const locationsModified = Object.values(locations).some(Boolean);
  const sessionTypesModified = Object.values(sessionTypes).some(Boolean);

  return [
    proceedingTypeModified,
    judgesModified,
    locationsModified,
    sessionTypesModified,
  ].some(Boolean);
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

function filterPastTrialSessionRows(
  trialSessionRows: (TrialSessionRow | TrialSessionWeek)[],
): {
  filteredTrialSessionRows: (TrialSessionRow | TrialSessionWeek)[];
  filteredTrialSessionRowsCount: number;
} {
  const filteredTrialSessionRows: (TrialSessionRow | TrialSessionWeek)[] = [];
  let filteredTrialSessionRowsCount = 0;
  const today = createISODateString();
  const todayAtStartOfDay = createISODateAtStartOfDayEST(today);
  let currentWeekHeader: TrialSessionWeek | null = null;

  for (const r of trialSessionRows) {
    if (isTrialSessionWeek(r)) {
      currentWeekHeader = r;
      // We'll add the week header only if there are valid sessions under it
      continue;
    }

    if (isTrialSessionRow(r)) {
      // If no end date, always show
      if (!r.estimatedEndDate) {
        if (currentWeekHeader) {
          filteredTrialSessionRows.push(currentWeekHeader);
          currentWeekHeader = null;
        }
        filteredTrialSessionRowsCount++;
        filteredTrialSessionRows.push(r);
        continue;
      }

      // Check if end date has passed
      const endDateIso = createISODateString(r.estimatedEndDate);
      const endDateAtStartOfDay = createISODateAtStartOfDayEST(endDateIso);
      const hasEndDatePassed =
        dateStringsCompared(endDateAtStartOfDay, todayAtStartOfDay) < 0;

      if (!hasEndDatePassed) {
        if (currentWeekHeader) {
          filteredTrialSessionRows.push(currentWeekHeader);
          currentWeekHeader = null;
        }
        filteredTrialSessionRowsCount++;
        filteredTrialSessionRows.push(r);
      }
    }
  }

  return { filteredTrialSessionRows, filteredTrialSessionRowsCount };
}

function dateComparison(tsGroup): boolean {
  // If no end date, always show (per acceptance criteria)
  if (!tsGroup?.estimatedEndDate) return true;

  const endDate = tsGroup.estimatedEndDate;
  const todayIso = createISODateString();
  const endDateIso = createISODateString(endDate);

  const endDateIsoAtStartOfDay = createISODateAtStartOfDayEST(endDateIso);
  const todayIsoAtStartOfDay = createISODateAtStartOfDayEST(todayIso);

  // Show if end date is today or in the future
  return dateStringsCompared(endDateIsoAtStartOfDay, todayIsoAtStartOfDay) >= 0;
}

export const publicTrialSessionsHelper = (
  get: Get,
): PublicTrialSessionsHelperResults => {
  const trialSessionJudges = get(state.judges) || [];
  const {
    judges = {},
    locations = {},
    pageNumber = 0,
    proceedingType = 'All',
    sessionTypes = {},
  } = get(state[PUBLIC_TRIAL_SESSIONS_DATA_KEY]);

  const trialSessions = get(state.trialSessionsPage.trialSessions) || [];
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

  const mobileFilteredGroups = filteredTrialSessions.filter(g =>
    dateComparison(g),
  );

  const paginatedMobileFilteredGroups = mobileFilteredGroups.slice(
    pageNumber * PAGE_SIZE,
    pageNumber * PAGE_SIZE + PAGE_SIZE,
  );

  const paginatedTrialSessions = filteredTrialSessions.slice(
    pageNumber * PAGE_SIZE,
    pageNumber * PAGE_SIZE + PAGE_SIZE,
  );

  const trialSessionRows = formatTrialSessions({
    trialSessions: paginatedTrialSessions,
  });

  const mobileTrialSessionRows = formatTrialSessions({
    trialSessions: paginatedMobileFilteredGroups,
  });

  const publicTrialSessionCount = filteredTrialSessions.reduce(
    (totalSum, ts) => {
      return dateComparison(ts) ? totalSum + 1 : totalSum;
    },
    0,
  );

  const allGroups = groupTrialSessions(mobileTrialSessionRows);
  const groupedMobileFilteredSessions = allGroups
    .map(tsGroup => ({
      header: tsGroup.header,
      rows: tsGroup.rows.filter(tsRow => dateComparison(tsRow)),
    }))
    .filter(tsGroup => tsGroup.rows.length > 0);

  const { filteredTrialSessionRows, filteredTrialSessionRowsCount } =
    filterPastTrialSessionRows(trialSessionRows);

  return {
    mobileFilteredGroups: groupedMobileFilteredSessions,
    publicTrialSessionCount,
    mobileTotalPages: Math.ceil(mobileFilteredGroups.length / PAGE_SIZE),
    filtersHaveBeenModified,
    sessionTypeOptions,
    totalPages: Math.ceil(filteredTrialSessions.length / PAGE_SIZE),
    trialCitiesByState,
    trialSessionJudgeOptions,
    trialSessionRows,
    filteredTrialSessionRows,
    filteredTrialSessionRowsCount,
    trialSessionsCount: filteredTrialSessions.length,
  };
};
