import { ALL_COUNTRY_TYPE } from '@shared/business/entities/cases/CaseSearch';
import {
  COUNTRY_TYPES,
  CountryTypes,
  ProcedureType,
} from '@shared/business/entities/EntityConstants';
import { CaseAdvancedSearchParamsRequestType } from '@web-api/business/useCases/caseAdvancedSearchInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const prepareFormDataForCaseSearchApi = (
  form: Omit<
    CaseAdvancedSearchParamsRequestType,
    'countryType' | 'procedureType'
  > & {
    countryType: typeof ALL_COUNTRY_TYPE | CountryTypes;
    procedureType: 'All' | ProcedureType;
  },
): CaseAdvancedSearchParamsRequestType => {
  return {
    ...form,
    countryType:
      form.countryType === ALL_COUNTRY_TYPE ? undefined : form.countryType,
    petitionerState:
      form.countryType === ALL_COUNTRY_TYPE ||
      form.countryType === COUNTRY_TYPES.INTERNATIONAL
        ? undefined
        : form.petitionerState,
    procedureType:
      form.procedureType === 'All' ? undefined : form.procedureType,
  };
};

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
