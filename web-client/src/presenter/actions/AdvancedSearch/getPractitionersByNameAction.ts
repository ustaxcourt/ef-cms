import { ALL_SELECTION } from '@shared/business/entities/cases/CaseSearch';
import { state } from '@web-client/presenter/app.cerebral';

export const getPractitionersByNameAction = async ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps<{ selectedPage: number }>) => {
  const { selectedPage } = props;

  const {
    admissionStatus,
    lastKeysOfPages,
    originalBarState,
    practiceType,
    practitionerName,
    practitionerType,
  }: {
    admissionStatus;
    lastKeysOfPages: Array<string | number>;
    originalBarState;
    pageNum: number;
    practiceType;
    practitionerName: string;
    practitionerType?: string;
  } = get(state.advancedSearchForm.practitionerSearchByName);

  store.set(
    state.advancedSearchForm.practitionerSearchByName.pageNum,
    selectedPage,
  );

  const { searchResults } = await applicationContext
    .getUseCases()
    .getPractitionersByNameInteractor(applicationContext, {
      admissionStatus,
      name: practitionerName,
      originalBarState,
      practiceType,
      practitionerType:
        practitionerType === ALL_SELECTION ? undefined : practitionerType,
      searchAfter: lastKeysOfPages[selectedPage],
    });

  store.set(
    state.advancedSearchForm.practitionerSearchByName.lastKeysOfPages[
      selectedPage + 1
    ],
    searchResults.lastKey,
  );

  return { searchResults };
};
