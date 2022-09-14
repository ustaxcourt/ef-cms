import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { computeFilingFormDateAction } from '../actions/FileDocument/computeFilingFormDateAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { getConstants } from '../../getConstants';
import { getDocketEntryAlertSuccessAction } from '../actions/DocketEntry/getDocketEntryAlertSuccessAction';
import { getDocketEntryAlertSuccessForConsolidatedGroupAction } from '../actions/CaseConsolidation/getDocketEntryAlertSuccessForConsolidatedGroupAction';
import { getFeatureFlagValueFactoryAction } from '../actions/getFeatureFlagValueFactoryAction';
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
  getComputedFormDateFactoryAction(null),
  computeFilingFormDateAction,
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
          getFeatureFlagValueFactoryAction(
            getConstants().ALLOWLIST_FEATURE_FLAGS
              .CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES,
          ),
          {
            no: [
              submitCourtIssuedDocketEntryAction,
              getDocketEntryAlertSuccessAction,
            ],
            yes: [
              shouldSaveToConsolidatedGroupAction,
              {
                no: [
                  submitCourtIssuedDocketEntryAction,
                  getDocketEntryAlertSuccessAction,
                ],
                yes: [
                  submitCourtIssuedDocketEntryToConsolidatedGroupAction,
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
