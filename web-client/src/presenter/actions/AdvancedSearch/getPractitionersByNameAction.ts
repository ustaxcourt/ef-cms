import { state } from '@web-client/presenter/app.cerebral';

export const getPractitionersByNameAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const {
    lastKeysOfPages,
    pageNum,
    practitionerName,
  }: { practitionerName: string; pageNum: number; lastKeysOfPages: string[] } =
    get(state.advancedSearchForm.practitionerSearchByName);

  const { searchResults } = await applicationContext
    .getUseCases()
    .getPractitionersByNameInteractor(applicationContext, {
      name: practitionerName,
      searchAfter: lastKeysOfPages[pageNum],
    });

  store.set(
    state.advancedSearchForm.practitinoerSearchByName.lastKeysOfPages[
      pageNum + 1
    ],
    searchResults.lastKey,
  );

  return { searchResults };
};
