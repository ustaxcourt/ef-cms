import { clearCourtIssuedDocketEntryFormValuesAction } from '../actions/CourtIssuedDocketEntry/clearCourtIssuedDocketEntryFormValuesAction';
import { computeFormDateFactoryAction } from '../actions/computeFormDateFactoryAction';
import { computeJudgeNameWithTitleAction } from '../actions/computeJudgeNameWithTitleAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { setDefaultFreeTextForCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/setDefaultFreeTextForCourtIssuedDocketEntryAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateCourtIssuedDocketEntryFormValueSequence = [
  setFormValueAction,
  clearCourtIssuedDocketEntryFormValuesAction,
  setDefaultFreeTextForCourtIssuedDocketEntryAction,
  computeFormDateFactoryAction(null),
  computeJudgeNameWithTitleAction,
  generateCourtIssuedDocumentTitleAction,
];
