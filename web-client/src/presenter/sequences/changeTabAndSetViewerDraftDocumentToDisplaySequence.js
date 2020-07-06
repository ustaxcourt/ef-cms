import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';
import { setViewerDraftDocumentToDisplayAction } from '../actions/setViewerDraftDocumentToDisplayAction';

export const changeTabAndSetViewerDraftDocumentToDisplaySequence = [
  navigateToCaseDetailAction,
  setCaseDetailPageTabActionGenerator('drafts'),
  setIsPrimaryTabAction,
  setCaseDetailPageTabFrozenAction,
  setViewerDraftDocumentToDisplayAction,
];
