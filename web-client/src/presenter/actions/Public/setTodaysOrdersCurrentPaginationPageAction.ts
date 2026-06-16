import { state } from '@web-client/presenter/app-public.cerebral';

export const setTodaysOrdersCurrentPaginationPageAction = ({
  props,
  store,
}: ActionProps & {
  props: { currentPaginationPage: number };
}) => {
  store.set(
    state.todaysOrdersCurrentPaginationPage,
    props.currentPaginationPage,
  );
};
