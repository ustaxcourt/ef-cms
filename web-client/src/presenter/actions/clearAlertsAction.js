import { state } from 'cerebral';

exports.clearAlertsAction = ({ store }) => {
  store.set(state.alertError, null);
  store.set(state.alertSuccess, null);
  store.set(state.caseDetailErrors, {});
  store.set(state.validationErrors, {});
};
