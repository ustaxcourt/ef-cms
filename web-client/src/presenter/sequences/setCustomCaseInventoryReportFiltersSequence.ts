import { setStartOrEndCreatedAtDateAction } from '../actions/CaseInventoryReport/setStartOrEndCreatedAtDateAction';

export const setCustomCaseInventoryReportFiltersSequence = [
  setStartOrEndCreatedAtDateAction,

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
