import { clearPdfPreviewUrlAction } from '../../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { createOrderAction } from '../../actions/CourtIssuedOrder/createOrderAction';
import { getPdfFromUrlAction } from '../../actions/CourtIssuedOrder/getPdfFromUrlAction';
import { setMetadataAsPristineAction } from '../../actions/setMetadataAsPristineAction';
import { setPdfFileAction } from '../../actions/CourtIssuedOrder/setPdfFileAction';
import { setPdfPreviewUrlAction } from '../../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { prepareMotionOrderResponseAction } from '@web-client/presenter/actions/MotionOrderResponse/prepareMotionOrderResponseAction';
import { getPdfUrlAction } from '@web-client/presenter/actions/CourtIssuedOrder/getPdfUrlAction';
import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';

export const motionOrderResponsePdfPreviewSequence =
  showProgressSequenceDecorator([
    prepareMotionOrderResponseAction,
    clearAlertsAction, // clear any existing alerts that are left over after form fixes
    createOrderAction,
    clearPdfPreviewUrlAction,
    getPdfUrlAction,
    getPdfFromUrlAction,
    setPdfFileAction,
    setPdfPreviewUrlAction,
    setMetadataAsPristineAction,
  ]) as unknown as () => void;
