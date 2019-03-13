import { state } from 'cerebral';

export const setFilingTypesAction = ({ store, props }) => {
  store.set(state.filingTypes, props.filingTypes);
};
