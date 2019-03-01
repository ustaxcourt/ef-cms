import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormsAction } from '../actions/clearFormsAction';
import { clearWorkItemActionMapAction } from '../actions/clearWorkItemActionMapAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getInternalUsersAction } from '../actions/getInternalUsersAction';
import { getProcedureTypesAction } from '../actions/getProcedureTypesAction';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultDocumentDetailTabAction } from '../actions/setDefaultDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setFormForCaseAction } from '../actions/setFormForCaseAction';
import { setInternalUsersAction } from '../actions/setInternalUsersAction';
import { setProcedureTypesAction } from '../actions/setProcedureTypesAction';
import { getCaseTypesAction } from '../actions/getCaseTypesAction';
import { setCaseTypesAction } from '../actions/setCaseTypesAction';

export const gotoDocumentDetailSequence = [
  setCurrentPageAction('Loading'),
  clearAlertsAction,
  clearWorkItemActionMapAction,
  clearFormsAction,
  setDocumentIdAction,
  getCaseAction,
  setCaseAction,
  setFormForCaseAction,
  setBaseUrlAction,
  getInternalUsersAction,
  setInternalUsersAction,
  setDefaultDocumentDetailTabAction,
  getProcedureTypesAction,
  setProcedureTypesAction,
  getCaseTypesAction,
  setCaseTypesAction,
  setCurrentPageAction('DocumentDetail'),
];
