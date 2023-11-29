import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { clearModalAction } from '@web-client/presenter/actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setDocketEntryWorksheetAction } from '@web-client/presenter/actions/PendingMotion/setDocketEntryWorksheetAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateDocketEntryWorksheetAction } from '@web-client/presenter/actions/PendingMotion/updateDocketEntryWorksheetAction';
import { validateDocketEntryWorksheetAction } from '@web-client/presenter/actions/validateDocketEntryWorksheetAction';

export const updateDocketEntryWorksheetSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateDocketEntryWorksheetAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      clearModalAction,
      stopShowValidationAction,
      clearAlertsAction,
      updateDocketEntryWorksheetAction,
      setDocketEntryWorksheetAction,
      clearModalStateAction,
      clearFormAction,
    ]),
  },
];
