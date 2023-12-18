import { COUNTRY_TYPES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

// TODO: decide if we can set a default state for state.advancedSearchForm (AND TYPE IT)
export const submitCaseAdvancedSearchAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const searchParams = get(state.advancedSearchForm.caseSearchByName);

  const searchResults = await applicationContext
    .getUseCases()
    .caseAdvancedSearchInteractor(applicationContext, {
      searchParams: {
        ...searchParams,
        countryType:
          searchParams.countryType === 'all'
            ? undefined
            : searchParams.countryType,
        petitionerState:
          searchParams.countryType === 'all' ||
          searchParams.countryType === COUNTRY_TYPES.INTERNATIONAL
            ? undefined
            : searchParams.petitionerState,
      },
    });

  return { searchResults };
};
