import clearAlerts from '../actions/clearAlertsAction';
import clearForm from '../actions/clearFormAction';
import clearPetition from '../actions/clearPetitionAction';
import getCaseTypes from '../actions/getCaseTypesAction';
import getProcedureTypes from '../actions/getProcedureTypesAction';
import setCaseTypes from '../actions/setCaseTypesAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import setProcedureTypes from '../actions/setProcedureTypesAction';

export default [
  clearAlerts,
  clearPetition,
  clearForm,
  getCaseTypes,
  setCaseTypes,
  getProcedureTypes,
  setProcedureTypes,
  setCurrentPage('StartCase'),
];
