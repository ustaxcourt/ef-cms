import { clearCourtIssuedDocketEntryFormValuesAction } from '../actions/CourtIssuedDocketEntry/clearCourtIssuedDocketEntryFormValuesAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { setDefaultFreeTextForCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/setDefaultFreeTextForCourtIssuedDocketEntryAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateCourtIssuedDocketEntryFormValueSequence = [
  setFormValueAction,
  clearCourtIssuedDocketEntryFormValuesAction,
  setDefaultFreeTextForCourtIssuedDocketEntryAction,
  computeFormDateAction,
  generateCourtIssuedDocumentTitleAction,
];
