import { generatePublicDocketRecordPdfUrlAction } from '../../actions/Public/generatePublicDocketRecordPdfUrlAction';
import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { setBaseUrlAction } from '../../actions/setBaseUrlAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from '../setPdfPreviewUrlSequence';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';

export const gotoPublicPrintableDocketRecordSequence = showProgressSequenceDecorator(
  [
    getPublicCaseAction,
    setCaseAction,
    setBaseUrlAction,
    generatePublicDocketRecordPdfUrlAction,
    setPdfPreviewUrlSequence,
    setCurrentPageAction('PublicPrintableDocketRecord'),
  ],
);
