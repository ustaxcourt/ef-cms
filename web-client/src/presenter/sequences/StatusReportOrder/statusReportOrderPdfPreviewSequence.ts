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
import { setTrialSessionIdFromCaseDetailAction } from '@web-client/presenter/actions/CaseDetail/setTrialSessionIdFromCaseDetailAction';
import { isCaseCalendaredAction } from '@web-client/presenter/actions/CaseDetail/isCaseCalendaredAction';

export const statusReportOrderPdfPreviewSequence =
  showProgressSequenceDecorator([
    isCaseCalendaredAction,
    {
      yes: [
        setTrialSessionIdFromCaseDetailAction,
        getTrialSessionDetailsAction,
        setTrialSessionDetailsAction,
      ],
      no: []
    },
    prepareStatusReportOrderAction,
    createOrderAction,
    clearPdfPreviewUrlAction,
    getStatusReportOrderPdfUrlAction,
    getPdfFromUrlAction,
    setPdfFileAction,
    setPdfPreviewUrlAction,
    setMetadataAsPristineAction,
  ]) as unknown as () => void;
