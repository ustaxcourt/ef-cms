import { clearModalStateAction } from '../../actions/clearModalStateAction';
import { generatePublicDocketRecordPdfUrlAction } from '../../actions/Public/generatePublicDocketRecordPdfUrlAction';
import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setPdfPreviewUrlSequence } from '../setPdfPreviewUrlSequence';
import { setShowModalFactoryAction } from '../../actions/setShowModalFactoryAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { showMaintenancePageDecorator } from '../../utilities/showMaintenancePageDecorator';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const gotoPublicPrintableDocketRecordSequence =
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
  ) as unknown as (props: { docketNumber: string }) => void;
