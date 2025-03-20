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
    isArray?: boolean;
  }>) => {
    const formType = formName || props.formType;

    if (props.isArray) {
      const currentValue =
        get(state.advancedSearchForm[formType][props.key]) || [];
      const updatedValue = currentValue.includes(props.value)
        ? currentValue.filter((value: string) => value !== props.value)
        : [...currentValue, props.value];
      if (updatedValue.length > 0) {
        store.set(state.advancedSearchForm[formType][props.key], updatedValue);
      } else {
        store.unset(state.advancedSearchForm[formType][props.key]); // Unset if empty
      }
      return;
    }

    if (props.value) {
      store.set(state.advancedSearchForm[formType][props.key], props.value);
    } else {
      store.unset(state.advancedSearchForm[formType][props.key]);
    }
  };
