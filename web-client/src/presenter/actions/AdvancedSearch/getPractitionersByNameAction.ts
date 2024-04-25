import { state } from '@web-client/presenter/app.cerebral';

export const getPractitionersByNameAction = async ({
  applicationContext,
  get,
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

  return { searchResults };
};
