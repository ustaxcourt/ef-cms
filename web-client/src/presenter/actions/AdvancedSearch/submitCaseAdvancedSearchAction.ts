import {
  COUNTRY_TYPES,
  CountryTypes,
} from '@shared/business/entities/EntityConstants';
import { CaseAdvancedSearchParamsRequestType } from '@shared/business/useCases/caseAdvancedSearchInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const prepareFormDataForCaseSearchApi = (
  form: Omit<CaseAdvancedSearchParamsRequestType, 'countryType'> & {
    countryType: 'all' | CountryTypes;
  },
): CaseAdvancedSearchParamsRequestType => {
  return {
    ...form,
    countryType: form.countryType === 'all' ? undefined : form.countryType,
    petitionerState:
      form.countryType === 'all' ||
      form.countryType === COUNTRY_TYPES.INTERNATIONAL
        ? undefined
        : form.petitionerState,
  };
};

// TODO: decide if we can set a default state for state.advancedSearchForm (AND TYPE IT)
export const submitCaseAdvancedSearchAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const searchParams = get(state.advancedSearchForm.caseSearchByName);

  const searchResults = await applicationContext
    .getUseCases()
    .caseAdvancedSearchInteractor(applicationContext, {
      searchParams: prepareFormDataForCaseSearchApi(searchParams),
    });

  return { searchResults };
};
