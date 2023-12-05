import { computeJudgeNameWithTitleAction } from '@web-client/presenter/actions/computeJudgeNameWithTitleAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';

export const updateCourtIssuedDocketEntryTitleSequence = [
  computeJudgeNameWithTitleAction,
  generateCourtIssuedDocumentTitleAction,
];
