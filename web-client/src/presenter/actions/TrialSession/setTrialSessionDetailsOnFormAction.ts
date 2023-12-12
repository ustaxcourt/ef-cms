import { state } from '@web-client/presenter/app.cerebral';

export const setTrialSessionDetailsOnFormAction = ({
  props,
  store,
}: ActionProps) => {
  const irsCalendarAdministratorInfo = props.trialSession
    .irsCalendarAdministratorInfo || {
    name: props.trialSession.irsCalendarAdministrator,
  };

  store.set(state.form, {
    ...props.trialSession,
    irsCalendarAdministrator: undefined,
    irsCalendarAdministratorInfo,
    judgeId: props.trialSession.judge && props.trialSession.judge.userId,
    trialClerkId:
      (props.trialSession.trialClerk && props.trialSession.trialClerk.userId) ||
      (props.trialSession.alternateTrialClerkName && 'Other'),
  });
};
