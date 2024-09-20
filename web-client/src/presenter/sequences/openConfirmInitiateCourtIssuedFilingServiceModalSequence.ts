import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { isDocketEntryMultiDocketableAction } from '../actions/CaseConsolidation/isDocketEntryMultiDocketableAction';
import { setMultiDocketingCheckboxesAction } from '../actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/validateCourtIssuedDocketEntryAction';

export const openConfirmInitiateCourtIssuedFilingServiceModalSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateCourtIssuedDocketEntryAction,
  {
    error: [
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      clearModalStateAction,
      isDocketEntryMultiDocketableAction,
      {
        no: [],
        yes: [setMultiDocketingCheckboxesAction],
      },
      setShowModalFactoryAction('ConfirmInitiateCourtIssuedFilingServiceModal'),
    ],
  },
];
