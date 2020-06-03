import { getServeToIrsAlertSuccessAction } from '../actions/StartCaseInternal/getServeToIrsAlertSuccessAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';

export const navigateToDocumentQcFromPrintPaperPetitionReceiptSequence = [
  setSaveAlertsForNavigationAction,
  getServeToIrsAlertSuccessAction,
  setAlertSuccessAction,
  navigateToDocumentQCAction,
];
