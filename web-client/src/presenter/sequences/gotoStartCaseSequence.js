import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPetitionAction } from '../actions/clearPetitionAction';
import { prepareFormAction } from '../actions/prepareFormAction';
import { getCaseTypesAction } from '../actions/getCaseTypesAction';
import { getFilingTypesAction } from '../actions/getFilingTypesAction';
import { setFilingTypesAction } from '../actions/setFilingTypesAction';
import { getProcedureTypesAction } from '../actions/getProcedureTypesAction';
import { setCaseTypesAction } from '../actions/setCaseTypesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setProcedureTypesAction } from '../actions/setProcedureTypesAction';

export const gotoStartCaseSequence = [
  clearAlertsAction,
  clearPetitionAction,
  clearFormAction,
  prepareFormAction,
  set(state.showValidation, false),
  getCaseTypesAction,
  setCaseTypesAction,
  getFilingTypesAction,
  setFilingTypesAction,
  getProcedureTypesAction,
  setProcedureTypesAction,
  setCurrentPageAction('StartCase'),
];
