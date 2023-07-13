import { clearModalStateAction } from '../../actions/clearModalStateAction';
import { generatePublicDocketRecordPdfUrlAction } from '../../actions/Public/generatePublicDocketRecordPdfUrlAction';
import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setPdfPreviewUrlSequence } from '../setPdfPreviewUrlSequence';
import { setShowModalFactoryAction } from '../../actions/setShowModalFactoryAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const gotoPublicPrintableDocketRecordSequence =
  showProgressSequenceDecorator([
    clearModalStateAction,
    getPublicCaseAction,
    setCaseAction,
    generatePublicDocketRecordPdfUrlAction,
    setPdfPreviewUrlSequence,
    setShowModalFactoryAction('OpenPrintableDocketRecordModal'),
    setupCurrentPageAction('PublicCaseDetail'),
  ]);
