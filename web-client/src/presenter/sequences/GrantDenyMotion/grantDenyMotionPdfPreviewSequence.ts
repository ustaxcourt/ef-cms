import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { clearPdfPreviewUrlAction } from '@web-client/presenter/actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { createOrderAction } from '@web-client/presenter/actions/CourtIssuedOrder/createOrderAction';
import { getPdfFromUrlAction } from '@web-client/presenter/actions/CourtIssuedOrder/getPdfFromUrlAction';
import { getPdfUrlAction } from '@web-client/presenter/actions/CourtIssuedOrder/getPdfUrlAction';
import { prepareGrantDenyMotionAction } from '@web-client/presenter/actions/GrantDenyMotion/prepareGrantDenyMotionAction';
import { setMetadataAsPristineAction } from '@web-client/presenter/actions/setMetadataAsPristineAction';
import { setPdfFileAction } from '@web-client/presenter/actions/CourtIssuedOrder/setPdfFileAction';
import { setPdfPreviewUrlAction } from '@web-client/presenter/actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';

export const grantDenyMotionPdfPreviewSequence = showProgressSequenceDecorator([
  prepareGrantDenyMotionAction,
  clearAlertsAction,
  createOrderAction,
  clearPdfPreviewUrlAction,
  getPdfUrlAction,
  getPdfFromUrlAction,
  setPdfFileAction,
  setPdfPreviewUrlAction,
  setMetadataAsPristineAction,
]) as unknown as () => void;
