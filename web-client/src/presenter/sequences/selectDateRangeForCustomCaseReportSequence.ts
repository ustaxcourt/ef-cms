import { normalizeDateFormatAction } from '../actions/CaseDeadline/normalizeDateFormatAction';
import { setStartOrEndCreatedAtDateAction } from '../actions/CaseInventoryReport/setStartOrEndCreatedAtDateAction';

export const selectDateRangeForCustomCaseReportSequence = [
  normalizeDateFormatAction,
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
