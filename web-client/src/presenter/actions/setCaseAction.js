import { state } from 'cerebral';

export default ({ store, props }) => {
  store.set(state.caseDetail, props.caseDetail);
};
