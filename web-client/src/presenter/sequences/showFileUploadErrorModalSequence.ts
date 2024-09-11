import { logErrorAction } from '@web-client/presenter/actions/logErrorAction';
import { openFileUploadErrorModal } from '@web-client/presenter/actions/openFileUploadErrorModal';
import { setErrorModalTroubleshootingStepsAction } from '@web-client/presenter/actions/setErrorModalTroubleshootingStepsAction';
import { setModalMessageAction } from '@web-client/presenter/actions/setModalMessageAction';
import { setModalTitleAction } from '@web-client/presenter/actions/setModalTitleAction';

export interface TroubleshootingLinkInfo {
  linkUrl: string;
  linkMessage: string;
}

export const showFileUploadErrorModalSequence = [
  setModalTitleAction,
  setModalMessageAction,
  setErrorModalTroubleshootingStepsAction,
  logErrorAction,
  openFileUploadErrorModal,
] as unknown as (props: {
  message?: string; // Overwrites the default
  title?: string; // Overwrites the default
  errorToLog?: string; // Error message to send to backend, if any
  contactSupportMessage?: string; // Please reach out to ...
  troubleshootingInfo?: TroubleshootingLinkInfo; // Follow this link for helpful tips ...
}) => void;
