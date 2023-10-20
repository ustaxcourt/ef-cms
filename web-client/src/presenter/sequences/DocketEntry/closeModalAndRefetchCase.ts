import { clearModalAction } from '../../actions/clearModalAction';
import { getCaseAction } from '../../actions/getCaseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const closeModalAndRefetchCase = showProgressSequenceDecorator([
  clearModalAction,
  getCaseAction,
  setCaseAction,
]);
