import { state } from '@web-client/presenter/app.cerebral';

export const setCurrentPaginationPageAction = ({
  props,
  store,
}: ActionProps & {
  props: { advancedSearchTab: string; currentPaginationPage: number };
}) => {
  const { advancedSearchTab, currentPaginationPage } = props;
  if (advancedSearchTab === 'case') {
    store.set(state.caseCurrentPaginationPage, currentPaginationPage);
  } else if (advancedSearchTab === 'order') {
    store.set(state.orderCurrentPaginationPage, currentPaginationPage);
  } else if (advancedSearchTab === 'opinion') {
    store.set(state.opinionCurrentPaginationPage, currentPaginationPage);
  }
};
