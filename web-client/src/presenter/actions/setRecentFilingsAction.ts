import { state } from '@web-client/presenter/app.cerebral';
import { RecentFiling } from '@shared/business/useCases/getRecentFilingsForUserInteractor';

export const setRecentFilingsAction = ({
  props,
  store,
}: ActionProps<{
  recentFilings: RecentFiling[];
}>) => {
  store.set(state.recentFilings, props.recentFilings);
};
