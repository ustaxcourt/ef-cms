import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { computeFilingFormDateAction } from '../actions/FileDocument/computeFilingFormDateAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagValueFactoryAction } from '../actions/getFeatureFlagValueFactoryAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setupConsolidatedCasesAction } from '../actions/CaseConsolidation/setupConsolidatedCasesAction';
import { shouldSaveToConsolidatedGroupAction } from '../actions/shouldSaveToConsolidatedGroupAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitCourtIssuedDocketEntrySequence } from './submitCourtIssuedDocketEntrySequence';
import { validateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/validateCourtIssuedDocketEntryAction';

export const saveCourtIssuedDocketEntrySequence = [
  getFeatureFlagValueFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS
      .CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES,
  ),
  {
    no: [submitCourtIssuedDocketEntrySequence],
    yes: [
      shouldSaveToConsolidatedGroupAction,
      {
        no: [submitCourtIssuedDocketEntrySequence],
        yes: [
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
            success: [
              clearModalStateAction,
              setupConsolidatedCasesAction,
              setShowModalFactoryAction('ConfirmInitiateSaveModal'),
            ],
          },
        ],
      },
    ],
  },
];
