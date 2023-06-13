import { state } from '@web-client/presenter/app.cerebral';
/**
 * get alert message when a trial session is created
 * @returns {object} the prop of the alert success message
 */
export const getCreateTrialSessionAlertSuccessAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.lastCreatedTrialSessionId, props.trialSession);

  return {
    alertSuccess: {
      message: 'Trial session added.',
    },
  };
};
