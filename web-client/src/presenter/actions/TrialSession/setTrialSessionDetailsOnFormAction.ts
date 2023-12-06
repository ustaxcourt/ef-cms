import { state } from '@web-client/presenter/app.cerebral';

export const setTrialSessionDetailsOnFormAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.form, {
    ...props.trialSession,
    judgeId: props.trialSession.judge && props.trialSession.judge.userId,
    trialClerkId:
      (props.trialSession.trialClerk && props.trialSession.trialClerk.userId) ||
      (props.trialSession.alternateTrialClerkName && 'Other'),
  });
};
