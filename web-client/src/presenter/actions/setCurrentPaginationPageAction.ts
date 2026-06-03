import { state } from '@web-client/presenter/app.cerebral';

export const setCurrentPaginationPageAction = ({
  props,
  store,
}: ActionProps & {
  props: { currentPaginationPage: number; advancedSearchTab: string };
}) => {
  const { advancedSearchTab, currentPaginationPage } = props;
  if (advancedSearchTab === 'case') {
    store.set(state.caseCurrentPaginationPage, currentPaginationPage);
  } else if (advancedSearchTab === 'opinion') {
    store.set(state.opinionCurrentPaginationPage, currentPaginationPage);
  } else {
    store.set(state.orderCurrentPaginationPage, currentPaginationPage);
  }
};
