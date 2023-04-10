import { setCustomCaseInventoryFiltersAction } from '../actions/CaseInventoryReport/setCustomCaseInventoryFiltersAction';

export const setCustomCaseInventoryReportFiltersSequence = [
  setCustomCaseInventoryFiltersAction,

  // shouldValidateAction,
  // {
  //   ignore: [],
  //   validate: [
  //     validateSearchDeadlinesAction,
  //     {
  //       error: [
  //         setAlertErrorAction,
  //         setValidationErrorsAction,
  //         setValidationAlertErrorsAction,
  //       ],
  //       success: [clearAlertsAction],
  //     },
  //   ],
  // },
];
