import { state } from '@web-client/presenter/app.cerebral';

export const updateAdvancedSearchFormAction =
  (formName?: string) =>
  ({
    props,
    store,
  }: ActionProps<{
    formType: string;
    key: string;
    value: string;
  }>) => {
    const formType = formName || props.formType;
    if (props.value) {
      store.set(state.advancedSearchForm[formType][props.key], props.value);
    } else {
      store.unset(state.advancedSearchForm[formType][props.key]);
    }
  };
