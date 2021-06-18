import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearDraftDocumentViewerDocketEntryIdAction } from '../actions/clearDraftDocumentViewerDocketEntryIdAction';
import { getIsOnCaseDetailAction } from '../actions/CaseDetail/getIsOnCaseDetailAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';
import { unsetCorrespondenceDocumentViewerIdAction } from '../actions/CorrespondenceDocument/unsetCorrespondenceDocumentViewerIdAction';

export const caseDetailPrimaryTabChangeSequence = [
  clearAlertsAction,
  getIsOnCaseDetailAction,
  {
    no: [setCaseDetailPageTabFrozenAction, navigateToCaseDetailAction],
    yes: [],
  },
  setIsPrimaryTabAction,
  clearDraftDocumentViewerDocketEntryIdAction,
  unsetCorrespondenceDocumentViewerIdAction,
];
