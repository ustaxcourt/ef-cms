import { state } from 'cerebral';

export default ({ store, props }) => {
  store.set(state.caseTypes, props.caseTypes);
};
