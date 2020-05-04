import { clearFormsAction } from '../actions/clearFormsAction';
import { clearWorkItemActionMapAction } from '../actions/clearWorkItemActionMapAction';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
import { getCaseAction } from '../actions/getCaseAction';
import { getInternalUsersAction } from '../actions/getInternalUsersAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { getShouldMarkReadAction } from '../actions/getShouldMarkReadAction';
import { parallel } from 'cerebral/factories';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultDocumentDetailTabAction } from '../actions/setDefaultDocumentDetailTabAction';
import { setDocumentDetailPageTitleAction } from '../actions/setDocumentDetailPageTitleAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setFormForCaseAction } from '../actions/setFormForCaseAction';
import { setInternalUsersAction } from '../actions/setInternalUsersAction';
import { setMessageIdAndCurrentTabFromUrlAction } from '../actions/setMessageIdAndCurrentTabFromUrlAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setWorkItemAction } from '../actions/setWorkItemAction';
import { setWorkItemAsReadAction } from '../actions/setWorkItemAsReadAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoDocumentDetailSequence = [
  setCurrentPageAction('Interstitial'),
  clearWorkItemActionMapAction,
  clearFormsAction,
  stopShowValidationAction,
  set(state.currentViewMetadata.documentDetail.tab, 'partyInfo'),
  setDocumentIdAction,
  getCaseAction,
  setCaseAction,
  setCaseOnFormAction,
  setFormForCaseAction,
  setDefaultDocumentDetailTabAction,
  setMessageIdAndCurrentTabFromUrlAction,
  getInternalUsersAction,
  setInternalUsersAction,
  set(state.editDocumentEntryPoint, 'DocumentDetail'),
  setDocumentDetailPageTitleAction,
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
    fetchUserNotificationsSequence,
  ]),
];
