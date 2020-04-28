import { generatePublicDocketRecordPdfUrlAction } from '../../actions/Public/generatePublicDocketRecordPdfUrlAction';
import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from '../setPdfPreviewUrlSequence';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';

export const gotoPublicPrintableDocketRecordSequence = showProgressSequenceDecorator(
  [
    getPublicCaseAction,
    setCaseAction,
    generatePublicDocketRecordPdfUrlAction,
    setPdfPreviewUrlSequence,
    setCurrentPageAction('PublicPrintableDocketRecord'),
  ],
);
