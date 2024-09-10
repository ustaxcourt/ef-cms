import { logErrorAction } from '@web-client/presenter/actions/logErrorAction';
import { openFileUploadErrorModal } from '@web-client/presenter/actions/openFileUploadErrorModal';
import { setErrorModalTroubleshootingStepsAction } from '@web-client/presenter/actions/setErrorModalTroubleshootingStepsAction';
import { setModalMessageAction } from '@web-client/presenter/actions/setModalMessageAction';
import { setModalTitleAction } from '@web-client/presenter/actions/setModalTitleAction';

export interface TroubleshootingLinkInfo {
  link: string;
  message: string;
}

export const showFileUploadErrorModalSequence = [
  setModalTitleAction,
  setModalMessageAction,
  setErrorModalTroubleshootingStepsAction,
  logErrorAction,
  openFileUploadErrorModal,
] as unknown as (props: {
  message: string;
  title: string;
  errorToLog?: any;
  contactSupportMessage?: string; // Please reach out to ...
  troubleshootingLink?: TroubleshootingLinkInfo; // Follow this link for helpful tips ...
}) => void;
