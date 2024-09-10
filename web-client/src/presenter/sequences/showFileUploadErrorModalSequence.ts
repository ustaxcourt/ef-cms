import { logErrorAction } from '@web-client/presenter/actions/logErrorAction';
import { setErrorModalTroubleshootingStepsAction } from '@web-client/presenter/actions/setErrorModalTroubleshootingStepsAction';
import { setModalMessageAction } from '@web-client/presenter/actions/setModalMessageAction';
import { setModalTitleAction } from '@web-client/presenter/actions/setModalTitleAction';
import { setShowModalFactoryAction } from '@web-client/presenter/actions/setShowModalFactoryAction';

export interface TroubleshootingLinkInfo {
  link: string;
  message: string;
}

export const showFileUploadErrorModalSequence = [
  setModalTitleAction,
  setModalMessageAction,
  setErrorModalTroubleshootingStepsAction,
  logErrorAction,
  setShowModalFactoryAction('FileUploadErrorModal'),
] as unknown as (props: {
  message?: string; // Overwrites the default
  title?: string; // Overwrites the default
  errorToLog?: any; // Error message to send to backend, if any
  contactSupportMessage?: string; // Please reach out to ...
  troubleshootingLink?: TroubleshootingLinkInfo; // Follow this link for helpful tips ...
}) => void;
