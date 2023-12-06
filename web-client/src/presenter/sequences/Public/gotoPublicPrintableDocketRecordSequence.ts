import { clearModalStateAction } from '../../actions/clearModalStateAction';
import { generatePublicDocketRecordPdfUrlAction } from '../../actions/Public/generatePublicDocketRecordPdfUrlAction';
import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { sequence } from 'cerebral';
import { setCaseAction } from '../../actions/setCaseAction';
import { setPdfPreviewUrlSequence } from '../setPdfPreviewUrlSequence';
import { setShowModalFactoryAction } from '../../actions/setShowModalFactoryAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { showMaintenancePageDecorator } from '../../utilities/showMaintenancePageDecorator';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const gotoPublicPrintableDocketRecordSequence = sequence<{
  docketNumber: string;
}>(
  showMaintenancePageDecorator(
    showProgressSequenceDecorator([
      clearModalStateAction,
      getPublicCaseAction,
      setCaseAction,
      generatePublicDocketRecordPdfUrlAction,
      setPdfPreviewUrlSequence,
      setShowModalFactoryAction('OpenPrintableDocketRecordModal'),
      setupCurrentPageAction('PublicCaseDetail'),
    ]),
  ),
);
