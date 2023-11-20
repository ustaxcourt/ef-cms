import {
  CASE_STATUSES,
  CASE_TYPES,
  CHIEF_JUDGE,
  CUSTOM_CASE_REPORT_PAGE_SIZE,
  TRIAL_CITIES,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import {
  CaseInventory,
  CustomCaseReportFilters,
} from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { Get } from 'cerebral';
import { InputOption } from '@web-client/ustc-ui/Utils/types';
import { sortBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const customCaseReportHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  activeTrialCities: InputOption[];
  caseStatuses: InputOption[];
  caseTypes: InputOption[];
  cases: (CaseInventory & {
    inConsolidatedGroup: boolean;
    consolidatedIconTooltipText: string;
    shouldIndent: boolean;
    isLeadCase: boolean;
  })[];
  clearFiltersIsDisabled: boolean;
  judges: InputOption[];
  pageCount: number;
  searchableTrialCities: InputOption[];
  today: string;
  trialCitiesByState: InputOption[];
} => {
  const caseStatuses = CASE_STATUSES.map(status => ({
    label: status,
    value: status,
  }));

  const caseTypes = CASE_TYPES.map(type => ({
    label: type,
    value: type,
  }));

  const cases = get(state.customCaseReport.cases);

  const formatDate = isoDateString =>
    applicationContext
      .getUtilities()
      .formatDateString(isoDateString, FORMATS.MMDDYY);

  const reportData = cases.map(entry => {
    const consolidatedEntry = applicationContext
      .getUtilities()
      .setConsolidationFlagsForDisplay(entry);

    consolidatedEntry.caseCaption = Case.getCaseTitle(entry.caseCaption);
    consolidatedEntry.receivedAt = formatDate(entry.receivedAt);

    return consolidatedEntry;
  });

  const populatedFilters: CustomCaseReportFilters = get(
    state.customCaseReport.filters,
  );

  const clearFiltersIsDisabled = ![
    ...populatedFilters.caseStatuses,
    ...populatedFilters.caseTypes,
    ...populatedFilters.judges,
    ...populatedFilters.preferredTrialCities,
  ].length;

  const judges = get(state.judges)
    .map(judge => ({
      label: judge.name,
      value: judge.name,
    }))
    .concat({ label: CHIEF_JUDGE, value: CHIEF_JUDGE })
    .sort((a, b) => {
      return applicationContext.getUtilities().compareStrings(a.label, b.label);
    });

  const totalCases = get(state.customCaseReport.totalCases);
  const pageCount = Math.ceil(totalCases / CUSTOM_CASE_REPORT_PAGE_SIZE);

  const today = applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD);

  const trialCities = sortBy(TRIAL_CITIES.ALL, ['state', 'city']);

  const searchableTrialCities: InputOption[] = [];

  const states: InputOption[] = trialCities.reduce(
    (listOfStates: InputOption[], cityStatePair) => {
      const existingState = listOfStates.find(
        trialState => trialState.label === cityStatePair.state,
      );
      const cityOption: InputOption = {
        label: `${cityStatePair.city}, ${cityStatePair.state}`,
        value: `${cityStatePair.city}, ${cityStatePair.state}`,
      };
      if (existingState) {
        existingState.options?.push(cityOption);
      } else {
        listOfStates.push({
          label: cityStatePair.state,
          options: [cityOption],
        });
      }
      searchableTrialCities.push(cityOption);
      return listOfStates;
    },
    [],
  );

  return {
    activeTrialCities: states,
    caseStatuses,
    caseTypes,
    cases: reportData,
    clearFiltersIsDisabled,
    judges,
    pageCount,
    searchableTrialCities,
    today,
    trialCitiesByState: states,
  };
};
