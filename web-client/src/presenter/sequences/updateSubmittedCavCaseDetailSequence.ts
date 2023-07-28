// import { clearAlertsAction } from '../actions/clearAlertsAction';
// import { setAlertErrorAction } from '../actions/setAlertErrorAction';
// import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
// import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updateSubmittedCavCaseDetailInStateAction } from '../actions/CaseWorksheet/updateSubmittedCavCaseDetailAction';
// import { validateSubmittedCavCaseDetailAction } from '../actions/CaseWorksheet/validateSubmittedCavCaseDetailAction';

export const updateSubmittedCavCaseDetailSequence = [
  //   clearAlertsAction,
  //   startShowValidationAction,
  //   validateSubmittedCavCaseDetailAction,
  //   {
  //     error: [setAlertErrorAction, setValidationErrorsAction],
  //     success: [updateSubmittedCavCaseDetailAction],
  //   },
  updateSubmittedCavCaseDetailInStateAction,
];
