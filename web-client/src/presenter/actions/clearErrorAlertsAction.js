import { state } from 'cerebral';

export default ({ store }) => {
  store.set(state.alertError, null);
  store.set(state.caseDetailErrors, {});
};
