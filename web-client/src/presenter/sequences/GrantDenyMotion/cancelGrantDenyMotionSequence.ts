import { clearPdfPreviewUrlAction as revokePdfPreviewUrlAction } from '@web-client/presenter/actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { clearPdfPreviewUrlAction } from '@web-client/presenter/actions/clearPdfPreviewUrlAction';
import { navigateBackSequence } from '@web-client/presenter/sequences/navigateBackSequence';

export const cancelGrantDenyMotionSequence = [
  revokePdfPreviewUrlAction,
  clearPdfPreviewUrlAction,
  ...navigateBackSequence,
] as unknown as () => void;
