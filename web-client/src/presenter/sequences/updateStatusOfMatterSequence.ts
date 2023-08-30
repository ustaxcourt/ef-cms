import { clearTableItemValidationErrorAction } from '../actions/CaseWorksheet/clearTableItemValidationErrorAction';
import { setTableItemValidationErrorsAction } from '../actions/setTableItemValidationErrorsAction';
import { setUpdatedCaseInStateAction } from '../actions/CaseWorksheet/setUpdatedCaseInStateAction';
import { updateStatusOfMatterAction } from '@web-client/presenter/actions/CaseWorksheet/updateStatusOfMatterAction';
import { validateStatusOfMatterAction } from '@web-client/presenter/actions/CaseWorksheet/validateStatusOfMatterAction';

export const updateStatusOfMatterSequence = [
  validateStatusOfMatterAction,
  {
    error: [setTableItemValidationErrorsAction],
    success: [
      clearTableItemValidationErrorAction,
      updateStatusOfMatterAction,
      setUpdatedCaseInStateAction,
    ],
  },
];
