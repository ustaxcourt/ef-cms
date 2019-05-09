import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormsAction } from '../actions/clearFormsAction';
import { clearWorkItemActionMapAction } from '../actions/clearWorkItemActionMapAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseTypesAction } from '../actions/getCaseTypesAction';
import { getInternalUsersAction } from '../actions/getInternalUsersAction';
import { getProcedureTypesAction } from '../actions/getProcedureTypesAction';
import { parallel } from 'cerebral/factories';
import { set } from 'cerebral/factories';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseTypesAction } from '../actions/setCaseTypesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setFormForCaseAction } from '../actions/setFormForCaseAction';
import { setInternalUsersAction } from '../actions/setInternalUsersAction';
import { setMessageAsReadAction } from '../actions/setMessageAsReadAction';
import { setMessageIdFromUrlAction } from '../actions/setMessageIdFromUrlAction';
import { setProcedureTypesAction } from '../actions/setProcedureTypesAction';
import { state } from 'cerebral';

export const gotoDocumentDetailMessageSequence = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  clearWorkItemActionMapAction,
  clearFormsAction,
  setBaseUrlAction,
  setMessageIdFromUrlAction,
  setDocumentIdAction,
  parallel([
    [setMessageAsReadAction],
    [getCaseAction, setCaseAction, setFormForCaseAction],
    [getInternalUsersAction, setInternalUsersAction],
  ]),
  set(state.currentTab, 'Messages'),
  getProcedureTypesAction,
  setProcedureTypesAction,
  getCaseTypesAction,
  setCaseTypesAction,
  setCurrentPageAction('DocumentDetail'),
];
