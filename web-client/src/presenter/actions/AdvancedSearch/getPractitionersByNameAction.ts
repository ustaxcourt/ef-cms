import { state } from '@web-client/presenter/app.cerebral';

export const getPractitionersByNameAction = async ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const {
    lastKeysOfPages,
    practitionerName,
  }: {
    practitionerName: string;
    pageNum: number;
    lastKeysOfPages: Array<string | number>;
  } = get(state.advancedSearchForm.practitionerSearchByName);

  store.set(
    state.advancedSearchForm.practitionerSearchByName.pageNum,
    props.selectedPage,
  );

  const { searchResults } = await applicationContext
    .getUseCases()
    .getPractitionersByNameInteractor(applicationContext, {
      name: practitionerName,
      searchAfter: lastKeysOfPages[props.selectedPage],
    });

  store.set(
    state.advancedSearchForm.practitionerSearchByName.lastKeysOfPages[
      props.selectedPage + 1
    ],
    searchResults.lastKey,
  );

  return { searchResults };
};
