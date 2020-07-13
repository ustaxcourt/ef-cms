import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';

export const closeModalAndReturnToCaseDetailDraftDocumentsSequence = [
  clearModalAction,
  setCasePropFromStateAction,
  setCaseDetailPageTabActionGenerator('drafts'),
  setIsPrimaryTabAction,
  setCaseDetailPageTabFrozenAction,
  navigateToCaseDetailAction,
];
