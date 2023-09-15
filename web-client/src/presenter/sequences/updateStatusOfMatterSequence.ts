import { clearTableItemValidationErrorAction } from '../actions/CaseWorksheet/clearTableItemValidationErrorAction';
import { setCaseWorksheetAction } from '../actions/CaseWorksheet/setCaseWorksheetAction';
import { setTableItemValidationErrorsAction } from '../actions/setTableItemValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { updateStatusOfMatterAction } from '@web-client/presenter/actions/CaseWorksheet/updateStatusOfMatterAction';
import { validateStatusOfMatterAction } from '@web-client/presenter/actions/CaseWorksheet/validateStatusOfMatterAction';

export const updateStatusOfMatterSequence = [
  validateStatusOfMatterAction,
  {
    error: [setTableItemValidationErrorsAction],
    success: showProgressSequenceDecorator([
      clearTableItemValidationErrorAction,
      updateStatusOfMatterAction,
      setCaseWorksheetAction,
    ]),
  },
];
