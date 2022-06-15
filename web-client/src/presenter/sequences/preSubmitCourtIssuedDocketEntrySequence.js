import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagValueFactoryAction } from '../actions/getFeatureFlagValueFactoryAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setupConsolidatedCasesAction } from '../actions/CaseConsolidation/setupConsolidatedCasesAction';
import { shouldOpenInitiateServiceModalAction } from '../actions/shouldOpenInitiateServiceModalAction';
import { submitCourtIssuedDocketEntrySequence } from './submitCourtIssuedDocketEntrySequence';

export const preSubmitCourtIssuedDocketEntrySequence = [
  getFeatureFlagValueFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS
      .CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES,
  ),
  {
    no: [submitCourtIssuedDocketEntrySequence],
    yes: [
      shouldOpenInitiateServiceModalAction,
      {
        openModal: [
          clearModalStateAction,
          setupConsolidatedCasesAction,
          setShowModalFactoryAction('ConfirmInitiateServiceModal'),
        ],
        submit: [submitCourtIssuedDocketEntrySequence],
      },
    ],
  },
];
