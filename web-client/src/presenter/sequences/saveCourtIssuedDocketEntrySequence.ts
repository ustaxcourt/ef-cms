import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { isDocketEntryMultiDocketableAction } from '../actions/CaseConsolidation/isDocketEntryMultiDocketableAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setMultiDocketingCheckboxesAction } from '../actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldSaveToConsolidatedGroupAction } from '../actions/shouldSaveToConsolidatedGroupAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitCourtIssuedDocketEntrySequence } from './submitCourtIssuedDocketEntrySequence';
import { validateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/validateCourtIssuedDocketEntryAction';

export const saveCourtIssuedDocketEntrySequence = [
  shouldSaveToConsolidatedGroupAction,
  {
    no: [submitCourtIssuedDocketEntrySequence],
    yes: [
      clearAlertsAction,
      startShowValidationAction,
      validateCourtIssuedDocketEntryAction,
      {
        error: [
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
        ],
        success: [
          clearModalStateAction,
          isDocketEntryMultiDocketableAction,
          {
            no: [],
            yes: [setMultiDocketingCheckboxesAction],
          },
          setShowModalFactoryAction('ConfirmInitiateSaveModal'),
        ],
      },
    ],
  },
];
