import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagValueFactoryAction } from '../actions/getFeatureFlagValueFactoryAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setupConsolidatedCasesAction } from '../actions/CaseConsolidation/setupConsolidatedCasesAction';
import { shouldOpenInitiateSaveModalAction } from '../actions/shouldOpenInitiateSaveModalAction';
import { submitCourtIssuedDocketEntrySequence } from './submitCourtIssuedDocketEntrySequence';

// TODO: CS maybe a better name for this?
export const preSubmitCourtIssuedDocketEntrySequence = [
  // TODO: CS maybe validate the form before opening the modal to save
  getFeatureFlagValueFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS
      .CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES,
  ),
  {
    no: [submitCourtIssuedDocketEntrySequence],
    yes: [
      shouldOpenInitiateSaveModalAction,
      {
        openModal: [
          clearModalStateAction,
          setupConsolidatedCasesAction,
          setShowModalFactoryAction('ConfirmInitiateSaveModal'),
        ],
        submit: [submitCourtIssuedDocketEntrySequence],
      },
    ],
  },
];
