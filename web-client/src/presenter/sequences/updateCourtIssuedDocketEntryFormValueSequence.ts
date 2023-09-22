import { clearCourtIssuedDocketEntryFormValuesAction } from '../actions/CourtIssuedDocketEntry/clearCourtIssuedDocketEntryFormValuesAction';
import { setDefaultFreeTextForCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/setDefaultFreeTextForCourtIssuedDocketEntryAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { updateCourtIssuedDocketEntryTitleSequence } from '@web-client/presenter/sequences/updateCourtIssuedDocketEntryTitleSequence';

export const updateCourtIssuedDocketEntryFormValueSequence = [
  setFormValueAction,
  clearCourtIssuedDocketEntryFormValuesAction,
  setDefaultFreeTextForCourtIssuedDocketEntryAction,
  updateCourtIssuedDocketEntryTitleSequence,
];
