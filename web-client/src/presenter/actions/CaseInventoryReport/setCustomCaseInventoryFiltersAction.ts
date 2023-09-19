/* eslint-disable complexity */
import {
  CaseStatus,
  CaseType,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { CustomCaseInventoryReportFilters } from '../../../../../web-api/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object used for passing props.date
 * @param {object} providers.store the cerebral store used for setting the state.customCaseInventoryFilters
 */
export const setCustomCaseInventoryFiltersAction = ({
  get,
  props,
  store,
}: {
  get: any;
  props: Partial<CustomCaseInventoryReportFilters> & {
    caseStatuses: { action: 'add' | 'remove'; caseStatus: CaseStatus };
    caseTypes: { action: 'add' | 'remove'; caseType: CaseType };
    judges: { action: 'add' | 'remove'; judge: string };
    preferredTrialCities: {
      action: 'add' | 'remove';
      preferredTrialCity: string;
    };
  };
  store: any;
}) => {
  const currentFilters: CustomCaseInventoryReportFilters = get(
    state.customCaseInventory.filters,
  );

  if (props.startDate || props.startDate === '') {
    store.set(state.customCaseInventory.filters.startDate, props.startDate);
  }
  if (props.endDate || props.endDate === '') {
    store.set(state.customCaseInventory.filters.endDate, props.endDate);
  }
  if (props.filingMethod) {
    store.set(
      state.customCaseInventory.filters.filingMethod,
      props.filingMethod,
    );
  }

  if (props.highPriority) {
    store.set(
      state.customCaseInventory.filters.highPriority,
      !get(state.customCaseInventory.filters.highPriority),
    );
  }

  if (props.procedureType) {
    store.set(
      state.customCaseInventory.filters.procedureType,
      props.procedureType,
    );
  }
  if (props.caseStatuses) {
    if (
      props.caseStatuses.action === 'add' &&
      !currentFilters.caseStatuses.includes(props.caseStatuses.caseStatus)
    ) {
      currentFilters.caseStatuses.push(props.caseStatuses.caseStatus);
      store.merge(state.customCaseInventory.filters, currentFilters);
    } else if (props.caseStatuses.action === 'remove') {
      const foundIndex = currentFilters.caseStatuses.findIndex(
        caseStatus => caseStatus === props.caseStatuses.caseStatus,
      );
      currentFilters.caseStatuses.splice(foundIndex, 1);
      store.merge(state.customCaseInventory.filters, currentFilters);
    }
  }
  if (props.caseTypes) {
    if (
      props.caseTypes.action === 'add' &&
      !currentFilters.caseTypes.includes(props.caseTypes.caseType)
    ) {
      currentFilters.caseTypes.push(props.caseTypes.caseType);
      store.merge(state.customCaseInventory.filters, currentFilters);
    } else if (props.caseTypes.action === 'remove') {
      const foundIndex = currentFilters.caseTypes.findIndex(
        caseType => caseType === props.caseTypes.caseType,
      );
      currentFilters.caseTypes.splice(foundIndex, 1);
      store.merge(state.customCaseInventory.filters, currentFilters);
    }
  }

  if (props.judges) {
    if (
      props.judges.action === 'add' &&
      !currentFilters.judges.includes(props.judges.judge)
    ) {
      currentFilters.judges.push(props.judges.judge);
      store.merge(state.customCaseInventory.filters, currentFilters);
    } else if (props.judges.action === 'remove') {
      const foundIndex = currentFilters.judges.findIndex(
        caseType => caseType === props.judges.judge,
      );
      currentFilters.judges.splice(foundIndex, 1);
      store.merge(state.customCaseInventory.filters, currentFilters);
    }
  }

  if (props.preferredTrialCities) {
    if (
      props.preferredTrialCities.action === 'add' &&
      !currentFilters.preferredTrialCities.includes(
        props.preferredTrialCities.preferredTrialCity,
      )
    ) {
      currentFilters.preferredTrialCities.push(
        props.preferredTrialCities.preferredTrialCity,
      );
      store.merge(state.customCaseInventory.filters, currentFilters);
    } else if (props.preferredTrialCities.action === 'remove') {
      const foundIndex = currentFilters.preferredTrialCities.findIndex(
        caseType => caseType === props.preferredTrialCities.preferredTrialCity,
      );
      currentFilters.preferredTrialCities.splice(foundIndex, 1);
      store.merge(state.customCaseInventory.filters, currentFilters);
    }
  }
};
