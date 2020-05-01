import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoPrintPaperServiceSequence = [
  setCurrentPageAction('Interstitial'),
  clearModalAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  setAlertWarningAction,
  setCurrentPageAction('PrintPaperService'),
];
