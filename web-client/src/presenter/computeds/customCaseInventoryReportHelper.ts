import {
  CASE_STATUSES,
  CASE_TYPES,
  CHIEF_JUDGE,
  CUSTOM_CASE_INVENTORY_PAGE_SIZE,
} from '../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { CustomCaseInventoryReportFilters } from '../../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { FORMATS } from '../../../../shared/src/business/utilities/DateHandler';
import { addConsolidatedProperties } from './utilities/addConsolidatedProperties';
import { findIndex, sortBy } from 'lodash';
import { state } from 'cerebral';

export const customCaseInventoryReportHelper = (get, applicationContext) => {
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
      caseObject: entry,
    });

    entry.caseTitle = Case.getCaseTitle(entry.caseCaption);
    entry.receivedAt = formatDate(entry.receivedAt);

    return entry;
  });

  const populatedFilters: CustomCaseInventoryReportFilters = get(
    state.customCaseInventory.filters,
  );

  const clearFiltersIsDisabled = ![
    ...populatedFilters.caseStatuses,
    ...populatedFilters.caseTypes,
  ].length;

  const judges: Object[] = get(state.judges)
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

  const { TRIAL_CITIES } = applicationContext.getConstants();

  const trialCities = sortBy(TRIAL_CITIES.ALL, ['state', 'city']);

  const getTrialLocationName = trialLocation =>
    `${trialLocation.city}, ${trialLocation.state}`;

  let states = [];

  const convertCityTypeFromStringToArray = trialCities.map(trialLocation => {
    return { ...trialLocation, city: [getTrialLocationName(trialLocation)] };
  });

  convertCityTypeFromStringToArray.forEach(loc => {
    const foundIndexOfState = findIndex(states, { state: loc.state });
    if (foundIndexOfState < 0) {
      states.push({
        cities: [...loc.city],
        state: loc.state,
      });
    } else {
      states[foundIndexOfState] = {
        ...states[foundIndexOfState],
        cities: [...states[foundIndexOfState].cities, ...loc.city],
      };
    }
  });

  states = states.map(obj => {
    return {
      label: obj.state,
      options: obj.cities.map(city => {
        return { label: city, value: city };
      }),
    };
  });

  return {
    caseStatuses,
    caseTypes,
    cases: reportData,
    clearFiltersIsDisabled,
    judges,
    pageCount,
    runReportButtonIsDisabled,
    today,
    trialCitiesByState: states,
  };
};
