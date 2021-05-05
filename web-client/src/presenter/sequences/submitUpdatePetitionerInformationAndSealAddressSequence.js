import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { sealAddressSequence } from './sealAddressSequence';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { updatePetitionerInformationAction } from '../actions/updatePetitionerInformationAction';

export const submitUpdatePetitionerInformationAndSealAddressSequence = [
  sealAddressSequence,
  updatePetitionerInformationAction,
  setPdfPreviewUrlAction,
  setSaveAlertsForNavigationAction,
  setAlertSuccessAction,
  setCurrentPageAction('Interstitial'),
  navigateToCaseDetailCaseInformationActionFactory('parties'),
];
