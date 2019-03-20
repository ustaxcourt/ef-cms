import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormsAction } from '../actions/clearFormsAction';
import { clearWorkItemActionMapAction } from '../actions/clearWorkItemActionMapAction';
import { defaultCaseCaptionAction } from '../actions/defaultCaseCaptionAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseTypesAction } from '../actions/getCaseTypesAction';
import { getInternalUsersAction } from '../actions/getInternalUsersAction';
import { getProcedureTypesAction } from '../actions/getProcedureTypesAction';
import { set } from 'cerebral/factories';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseTypesAction } from '../actions/setCaseTypesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultDocumentDetailTabAction } from '../actions/setDefaultDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setFormForCaseAction } from '../actions/setFormForCaseAction';
import { setInternalUsersAction } from '../actions/setInternalUsersAction';
import { setProcedureTypesAction } from '../actions/setProcedureTypesAction';
import { state } from 'cerebral';

export const gotoDocumentDetailSequence = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  clearWorkItemActionMapAction,
  clearFormsAction,
  set(state.documentDetail.tab, 'partyInfo'),
  setDocumentIdAction,
  getCaseAction,
  setCaseAction,
  defaultCaseCaptionAction,
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
