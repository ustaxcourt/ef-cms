import { hasUpdatedPetitionerEmailAction } from '../actions/hasUpdatedPetitionerEmailAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { openGainElectronicAccessToCaseModalSequence } from './openGainElectronicAccessToCaseModalSequence';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updatePetitionerInformationAction } from '../actions/updatePetitionerInformationAction';
import { validatePetitionerInformationFormAction } from '../actions/validatePetitionerInformationFormAction';

/**
 * attempts to update the petitioner information
 */
export const updatePetitionerInformationFormSequence = [
  startShowValidationAction,
  validatePetitionerInformationFormAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: showProgressSequenceDecorator([
      hasUpdatedPetitionerEmailAction,
      {
        no: [
          updatePetitionerInformationAction,
          setPdfPreviewUrlAction,
          setSaveAlertsForNavigationAction,
          setAlertSuccessAction,
          navigateToCaseDetailCaseInformationActionFactory('petitioner'),
        ],
        yes: [openGainElectronicAccessToCaseModalSequence],
      },
    ]),
  },
];
