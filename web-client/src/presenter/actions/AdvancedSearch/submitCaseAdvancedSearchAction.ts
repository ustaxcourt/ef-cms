import {
  ALL_SELECTION,
  CaseType,
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
    countryType: typeof ALL_SELECTION | CountryTypes;
    procedureType: typeof ALL_SELECTION | ProcedureType;
    caseTypes: Record<string, CaseType | CaseType[]>;
  },
): CaseAdvancedSearchParamsRequestType => {
  return {
    ...form,
    countryType:
      form.countryType === ALL_SELECTION ? undefined : form.countryType,
    petitionerState:
      form.countryType === ALL_SELECTION ||
      form.countryType === COUNTRY_TYPES.INTERNATIONAL
        ? undefined
        : form.petitionerState,
    procedureType:
      form.procedureType === ALL_SELECTION ? undefined : form.procedureType,
    caseTypes: form.caseTypes
      ? Object.values(form.caseTypes).flat()
      : undefined,
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
