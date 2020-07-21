import { clearFormsAction } from '../actions/clearFormsAction';
import { clearWorkItemActionMapAction } from '../actions/clearWorkItemActionMapAction';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
import { getCaseAction } from '../actions/getCaseAction';
import { getInternalUsersAction } from '../actions/getInternalUsersAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { getShouldMarkReadAction } from '../actions/getShouldMarkReadAction';
import { parallel, set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentDetailPageTitleAction } from '../actions/setDocumentDetailPageTitleAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setInternalUsersAction } from '../actions/setInternalUsersAction';
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
  setDocumentIdAction,
  getCaseAction,
  setCaseAction,
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
