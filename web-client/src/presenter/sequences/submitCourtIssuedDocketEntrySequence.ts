import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { generateCoversheetAction } from '../actions/DocketEntry/generateCoversheetAction';
import { getDocketEntryAlertSuccessAction } from '../actions/DocketEntry/getDocketEntryAlertSuccessAction';
import { getDocketEntryAlertSuccessForConsolidatedGroupAction } from '../actions/CaseConsolidation/getDocketEntryAlertSuccessForConsolidatedGroupAction';
import { getDocketNumbersForConsolidatedServiceAction } from '../actions/getDocketNumbersForConsolidatedServiceAction';
import { isCoversheetNeededAction } from '../actions/DocketEntry/isCoversheetNeededAction';
import { isEditingDocketEntryAction } from '../actions/CourtIssuedDocketEntry/isEditingDocketEntryAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldSaveToConsolidatedGroupAction } from '../actions/shouldSaveToConsolidatedGroupAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { submitCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/submitCourtIssuedDocketEntryAction';
import { submitCourtIssuedDocketEntryToConsolidatedGroupAction } from '../actions/CourtIssuedDocketEntry/submitCourtIssuedDocketEntryToConsolidatedGroupAction';
import { updateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/updateCourtIssuedDocketEntryAction';
import { validateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/validateCourtIssuedDocketEntryAction';

export const submitCourtIssuedDocketEntrySequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateCourtIssuedDocketEntryAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      clearAlertsAction,
      isEditingDocketEntryAction,
      {
        getDocketEntryAlertSuccessAction,
        no: [
          shouldSaveToConsolidatedGroupAction,
          {
            no: [
              submitCourtIssuedDocketEntryAction,
              isCoversheetNeededAction,
              {
                no: [],
                yes: [generateCoversheetAction],
              },
              getDocketEntryAlertSuccessAction,
            ],
            yes: [
              shouldSaveToConsolidatedGroupAction,
              {
                no: [
                  submitCourtIssuedDocketEntryAction,
                  isCoversheetNeededAction,
                  {
                    no: [],
                    yes: [generateCoversheetAction],
                  },
                  getDocketEntryAlertSuccessAction,
                ],
                yes: [
                  getDocketNumbersForConsolidatedServiceAction,
                  submitCourtIssuedDocketEntryToConsolidatedGroupAction,
                  isCoversheetNeededAction,
                  {
                    no: [],
                    yes: [generateCoversheetAction],
                  },
                  getDocketEntryAlertSuccessForConsolidatedGroupAction,
                  clearModalAction,
                ],
              },
            ],
          },
        ],
        yes: [
          updateCourtIssuedDocketEntryAction,
          getDocketEntryAlertSuccessAction,
        ],
      },

      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      followRedirectAction,
      {
        default: navigateToCaseDetailAction,
        success: [],
      },
    ]),
  },
];
