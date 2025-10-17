import { state } from '@web-client/presenter/app.cerebral';

export const getCreateTrialSessionAlertSuccessAction = ({
  props,
  store,
}: ActionProps<{
  trialSession: string;
}>): {
  alertSuccess: {
    message: string;
    metaData: string;
  };
} => {
  store.set(
    (state as { lastCreatedTrialSessionId: unknown }).lastCreatedTrialSessionId,
    props.trialSession,
  );

  return {
    alertSuccess: {
      message: 'Trial session added.',
      metaData: props.trialSession,
    },
  };
};
