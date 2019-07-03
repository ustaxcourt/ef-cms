import { state } from 'cerebral';

export const setFilingTypesAction = ({ props, store }) => {
  store.set(state.filingTypes, props.filingTypes);
};
