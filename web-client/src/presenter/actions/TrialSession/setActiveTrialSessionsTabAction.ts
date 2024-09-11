import { TrialSessionScope } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setActiveTrialSessionsTabAction = ({
  store,
}: ActionProps<{ sessionScope: TrialSessionScope }>) => {
  store.set(state.trialSessionsPage.filters.currentTab, 'new');
};
