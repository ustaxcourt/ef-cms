import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { updatePetitionerInformationAction } from '../actions/updatePetitionerInformationAction';

export const submitUpdatePetitionerInformationSequence = [
  updatePetitionerInformationAction,
  setPdfPreviewUrlAction,
  setSaveAlertsForNavigationAction,
  setAlertSuccessAction,
];
