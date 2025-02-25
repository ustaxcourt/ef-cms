import { state } from '@web-client/presenter/app.cerebral';

export const setErrorModalTroubleshootingStepsAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.modal.contactSupportMessage, props.contactSupportMessage);
  store.set(state.modal.troubleshootingInfo, props.troubleshootingInfo);
};
