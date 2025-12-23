import { applicationContext } from '@web-client/applicationContext';
import { state } from '@web-client/presenter/app.cerebral';

export const updateAdvancedSearchFormAction =
  (formName?: string) =>
  ({
    props,
    store,
    get,
  }: ActionProps<{
    formType: string;
    key: string;
    value: string | object;
    isMultiSelect?: boolean;
  }>) => {
    const formType = formName || props.formType;
    const formFieldPath = state.advancedSearchForm[formType][props.key];

    if (props.isMultiSelect) {
      const currentValues = get(formFieldPath) || [];
      const isSelected = currentValues.includes(props.value);
      const updatedValues = isSelected
        ? currentValues.filter((value: string) => value !== props.value)
        : [...currentValues, props.value];

      if (updatedValues.length > 0) {
        store.set(formFieldPath, updatedValues);
      } else {
        store.unset(formFieldPath); // Clear field if nothing selected
      }
      return;
    }

    if (props.value) {
      if (
        (props.key === 'startDate' || props.key === 'endDate') &&
        formType === 'orderSearch'
      ) {
        store.set(
          state.advancedSearchForm[formType].dateRange,
          applicationContext.getConstants().DATE_RANGE_SEARCH_OPTIONS
            .CUSTOM_DATES,
        );
      }
      store.set(formFieldPath, props.value);
    } else {
      store.unset(formFieldPath);
    }
  };
