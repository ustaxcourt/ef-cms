import { clearPdfPreviewUrlAction } from '../../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { createOrderAction } from '../../actions/CourtIssuedOrder/createOrderAction';
import { getPdfFromUrlAction } from '../../actions/CourtIssuedOrder/getPdfFromUrlAction';
import { getStatusReportOrderPdfUrlAction } from '../../actions/StatusReportOrder/getStatusReportOrderPdfUrlAction';
import { prepareStatusReportOrderAction } from '../../actions/StatusReportOrder/prepareStatusReportOrderAction';
import { setMetadataAsPristineAction } from '../../actions/setMetadataAsPristineAction';
import { setPdfFileAction } from '../../actions/CourtIssuedOrder/setPdfFileAction';
import { setPdfPreviewUrlAction } from '../../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { getTrialSessionDetailsAction } from '@web-client/presenter/actions/TrialSession/getTrialSessionDetailsAction';
import { setTrialSessionDetailsAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionDetailsAction';
import { setTrialSessionIdFromCaseDetailAction } from './setTrialSessionIdFromCaseDetailAction';

export const statusReportOrderPdfPreviewSequence =
  showProgressSequenceDecorator([
    setTrialSessionIdFromCaseDetailAction,
    getTrialSessionDetailsAction,
    setTrialSessionDetailsAction,
    prepareStatusReportOrderAction,
    createOrderAction,
    clearPdfPreviewUrlAction,
    getStatusReportOrderPdfUrlAction,
    getPdfFromUrlAction,
    setPdfFileAction,
    setPdfPreviewUrlAction,
    setMetadataAsPristineAction,
  ]) as unknown as () => void;
