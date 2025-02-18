import {
  SESSION_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import {
  TrialSessionRow,
  TrialSessionWeek,
  formatTrialSessions,
} from '@web-client/presenter/computeds/trialSessionsHelper';
import { getTrialCitiesGroupedByState } from '@shared/business/utilities/trialSession/trialCitiesGroupedByState';
import { RawUser } from '@shared/business/entities/User';
import { TrialSessionFilters } from 'web-client-public/src/routes/trial-sessions/PublicTrialSessions';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';

export const publicTrialSessionsComputed = ({
  trialSessionJudges,
  trialSessionFilters,
  trialSessions,
}: {
  trialSessionJudges: RawUser[];
  trialSessionFilters: TrialSessionFilters;
  trialSessions: TrialSessionInfoDTO[];
}): {
  sessionTypeOptions: {
    label: string;
    value: string;
  }[];
  trialCitiesByState: {
    label: string;
    options: { label: string; value: string }[];
  }[];
  judgeOptions: {
    label: string;
    value: { name: string; userId: string };
  }[];
  filtersHaveBeenModified: boolean;
  trialSessionsCount: number;
  trialSessionRows: (TrialSessionRow | TrialSessionWeek)[];
} => {
  const { judges, locations, proceedingType, sessionTypes } =
    trialSessionFilters;

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

  const judgeOptions = trialSessionJudges.map(trialSessionJudge => ({
    label: trialSessionJudge.name,
    value: { name: trialSessionJudge.name, userId: trialSessionJudge.userId },
  }));

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
    .filter(ts => !Object.entries(judges).length || judges[ts.judge?.userId!])
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

  const trialSessionRows = formatTrialSessions({
    trialSessions: filteredTrialSessions,
  });

  return {
    filtersHaveBeenModified,
    sessionTypeOptions,
    trialCitiesByState,
    judgeOptions,
    trialSessionRows,
    trialSessionsCount: filteredTrialSessions.length,
  };
};

function areAnyFiltersModified(
  proceedingType: string,
  judges: Record<string, { name: string; userId: string }>,
  locations: Record<string, string>,
  sessionTypes: Record<string, TrialSessionTypes>,
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
