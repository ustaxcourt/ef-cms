import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormsAction } from '../actions/clearFormsAction';
import { clearWorkItemActionMapAction } from '../actions/clearWorkItemActionMapAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseTypesAction } from '../actions/getCaseTypesAction';
import { getInternalUsersAction } from '../actions/getInternalUsersAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { getProcedureTypesAction } from '../actions/getProcedureTypesAction';
import { getShouldMarkReadAction } from '../actions/getShouldMarkReadAction';
import { parallel } from 'cerebral/factories';
import { set } from 'cerebral/factories';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseTypesAction } from '../actions/setCaseTypesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultDocumentDetailTabAction } from '../actions/setDefaultDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setFormForCaseAction } from '../actions/setFormForCaseAction';
import { setInternalUsersAction } from '../actions/setInternalUsersAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setProcedureTypesAction } from '../actions/setProcedureTypesAction';
import { setWorkItemAction } from '../actions/setWorkItemAction';
import { setWorkItemAsReadAction } from '../actions/setWorkItemAsReadAction';
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
  parallel([
    getShouldMarkReadAction,
    {
      markRead: [
        setWorkItemAction,
        setWorkItemAsReadAction,
        getNotificationsAction,
        setNotificationsAction,
      ],
      noAction: [],
    },
  ]),
];
