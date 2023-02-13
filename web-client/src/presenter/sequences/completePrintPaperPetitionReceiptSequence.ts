import { followRedirectAction } from '../actions/followRedirectAction';
import { getServeToIrsAlertSuccessAction } from '../actions/StartCaseInternal/getServeToIrsAlertSuccessAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';

export const completePrintPaperPetitionReceiptSequence = [
  setSaveAlertsForNavigationAction,
  getServeToIrsAlertSuccessAction,
  setAlertSuccessAction,
  followRedirectAction,
  {
    default: [navigateToDocumentQCAction],
    success: [],
  },
];
