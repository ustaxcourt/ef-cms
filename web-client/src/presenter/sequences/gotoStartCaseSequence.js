import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPetitionAction } from '../actions/clearPetitionAction';
import prepareForm from '../actions/prepareFormAction';
import { getCaseTypes } from '../actions/getCaseTypesAction';
import getFilingTypes from '../actions/getFilingTypesAction';
import setFilingTypes from '../actions/setFilingTypesAction';
import getProcedureTypes from '../actions/getProcedureTypesAction';
import setCaseTypes from '../actions/setCaseTypesAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import setProcedureTypes from '../actions/setProcedureTypesAction';

export default [
  clearAlertsAction,
  clearPetitionAction,
  clearFormAction,
  prepareForm,
  set(state.showValidation, false),
  getCaseTypes,
  setCaseTypes,
  getFilingTypes,
  setFilingTypes,
  getProcedureTypes,
  setProcedureTypes,
  setCurrentPage('StartCase'),
];
