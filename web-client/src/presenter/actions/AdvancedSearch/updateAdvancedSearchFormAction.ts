import { state } from '@web-client/presenter/app.cerebral';

export const updateAdvancedSearchFormAction =
  (formName?: string) =>
  ({
    props,
    store,
  }: ActionProps<{
    key: string;
    value: string;
    formType: string;
  }>) => {
    const formType = formName || props.formType;
    if (props.value) {
      store.set(state.advancedSearchForm[formType][props.key], props.value);
    } else {
      store.unset(state.advancedSearchForm[formType][props.key]);
    }
  };
