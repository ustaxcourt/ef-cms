import {
  CASE_STATUSES,
  CASE_TYPES,
  CHIEF_JUDGE,
  CUSTOM_CASE_INVENTORY_PAGE_SIZE,
  TRIAL_CITIES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CustomCaseInventoryReportFilters } from '../../../../web-api/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { FORMATS } from '../../../../shared/src/business/utilities/DateHandler';
import { Get } from 'cerebral';
import { InputOption } from '@web-client/ustc-ui/Utils/types';
import { addConsolidatedProperties } from './utilities/addConsolidatedProperties';
import { sortBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const customCaseInventoryReportHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const caseStatuses = CASE_STATUSES.map(status => ({
    label: status,
    value: status,
  }));

  const caseTypes = CASE_TYPES.map(type => ({
    label: type,
    value: type,
  }));

  const cases = get(state.customCaseInventory.cases);

  const formatDate = isoDateString =>
    applicationContext
      .getUtilities()
      .formatDateString(isoDateString, FORMATS.MMDDYY);

  const reportData = cases.map(entry => {
    entry = addConsolidatedProperties({
      applicationContext,
      consolidatedObject: entry,
    });

    entry.caseCaption = Case.getCaseTitle(entry.caseCaption);
    entry.receivedAt = formatDate(entry.receivedAt);

    return entry;
  });

  const populatedFilters: CustomCaseInventoryReportFilters = get(
    state.customCaseInventory.filters,
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

  const totalCases = get(state.customCaseInventory.totalCases);
  const pageCount = Math.ceil(totalCases / CUSTOM_CASE_INVENTORY_PAGE_SIZE);

  const runReportButtonIsDisabled = !(
    populatedFilters.startDate && populatedFilters.endDate
  );

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
    runReportButtonIsDisabled,
    searchableTrialCities,
    today,
    trialCitiesByState: states,
  };
};
