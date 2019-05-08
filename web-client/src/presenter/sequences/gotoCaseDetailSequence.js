import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { set } from 'cerebral/factories';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';

export const gotoCaseDetailSequence = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  set(state.documentDetail.tab, 'docketRecord'),
  set(state.sessionMetadata.docketRecordSort, 'byDate'),
  setBaseUrlAction,
  getUserRoleAction,
  {
    docketclerk: [setCurrentPageAction('CaseDetailInternal')],
    intakeclerk: [setCurrentPageAction('CaseDetailInternal')],
    petitioner: [setCurrentPageAction('CaseDetail')],
    petitionsclerk: [setCurrentPageAction('CaseDetailInternal')],
    practitioner: [setCurrentPageAction('CaseDetail')],
    respondent: [setCurrentPageAction('CaseDetail')],
    seniorattorney: [setCurrentPageAction('CaseDetailInternal')],
  },
];
