import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearDocumentViewerDataSequence } from './clearDocumentViewerDataSequence';
import { getIsOnCaseDetailAction } from '../actions/CaseDetail/getIsOnCaseDetailAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';

export const caseDetailPrimaryTabChangeSequence = [
  clearAlertsAction,
  getIsOnCaseDetailAction,
  {
    no: [setCaseDetailPageTabFrozenAction, navigateToCaseDetailAction],
    yes: [],
  },
  setIsPrimaryTabAction,
  clearDocumentViewerDataSequence,
];
