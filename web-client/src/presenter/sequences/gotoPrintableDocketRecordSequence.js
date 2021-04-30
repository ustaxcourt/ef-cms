import { clearModalStateAction } from '../actions/clearModalStateAction';
import { generateDocketRecordPdfUrlAction } from '../actions/generateDocketRecordPdfUrlAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { getShouldIncludePartyDetailAction } from '../actions/getShouldIncludePartyDetailAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const gotoPrintableDocketRecordSequence = showProgressSequenceDecorator([
  clearModalStateAction,
  getCaseAction,
  setCaseAction,
  getCaseAssociationAction,
  getShouldIncludePartyDetailAction,
  generateDocketRecordPdfUrlAction,
  setPdfPreviewUrlSequence,
  setShowModalFactoryAction('OpenPrintableDocketRecordModal'),
]);
