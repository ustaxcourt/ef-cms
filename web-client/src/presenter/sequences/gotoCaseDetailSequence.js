import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { getCaseDeadlinesForCaseAction } from '../actions/CaseDeadline/getCaseDeadlinesForCaseAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseAssociationAction } from '../actions/setCaseAssociationAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultDocketRecordSortAction } from '../actions/DocketRecord/setDefaultDocketRecordSortAction';

export const gotoCaseDetailSequence = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  getCaseDeadlinesForCaseAction,
  setDefaultDocketRecordSortAction,
  setBaseUrlAction,
  getUserRoleAction,
  {
    docketclerk: [setCurrentPageAction('CaseDetailInternal')],
    petitioner: [
      getCaseAssociationAction,
      setCaseAssociationAction,
      setCurrentPageAction('CaseDetail'),
    ],
    petitionsclerk: [setCurrentPageAction('CaseDetailInternal')],
    practitioner: [
      getCaseAssociationAction,
      setCaseAssociationAction,
      setCurrentPageAction('CaseDetail'),
    ],
    respondent: [
      getCaseAssociationAction,
      setCaseAssociationAction,
      setCurrentPageAction('CaseDetail'),
    ],
    seniorattorney: [setCurrentPageAction('CaseDetailInternal')],
  },
];
