import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCaseDetailPageTabAction } from '../actions/setCaseDetailPageTabAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setTabToInProgressAction } from '../actions/editUploadCourtIssuedDocument/setTabToInProgressAction';

export const closeModalAndReturnToCaseDetailDraftDocumentsSequence = [
  clearModalAction,
  setCasePropFromStateAction,
  setTabToInProgressAction,
  setCaseDetailPageTabAction,
  setCaseDetailPageTabFrozenAction,
  navigateToCaseDetailAction,
];
