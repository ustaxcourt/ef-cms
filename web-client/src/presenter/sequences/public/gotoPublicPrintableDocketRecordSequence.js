import { clearModalStateAction } from '../../actions/clearModalStateAction';
import { generatePublicDocketRecordPdfUrlAction } from '../../actions/Public/generatePublicDocketRecordPdfUrlAction';
import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setPdfPreviewUrlSequence } from '../setPdfPreviewUrlSequence';
import { setShowModalFactoryAction } from '../../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';

export const gotoPublicPrintableDocketRecordSequence = showProgressSequenceDecorator(
  [
    clearModalStateAction,
    getPublicCaseAction,
    setCaseAction,
    generatePublicDocketRecordPdfUrlAction,
    setPdfPreviewUrlSequence,
    setShowModalFactoryAction('OpenPrintableDocketRecordModal'),
  ],
);
