import { state } from '@web-client/presenter/app.cerebral';

export const setCurrentPaginationPageAction = ({
  props,
  store,
}: ActionProps & {
  props: { currentPaginationPage: number; advancedSearchTab: string };
}) => {
  const { advancedSearchTab, currentPaginationPage } = props;
  if (advancedSearchTab === 'opinion') {
    store.set(state.opinionCurrentPaginationPage, currentPaginationPage);
  } else {
    store.set(state.orderCurrentPaginationPage, currentPaginationPage);
  }
};
