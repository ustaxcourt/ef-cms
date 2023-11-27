import { TRIAL_SESSION_SCOPE_TYPES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setActiveTrialSessionsTabAction = ({
  props,
  store,
}: ActionProps) => {
  const activeTab =
    props.sessionScope === TRIAL_SESSION_SCOPE_TYPES.locationBased
      ? 'new'
      : 'open';

  store.set(state.currentViewMetadata.trialSessions.tab, activeTab);
};
