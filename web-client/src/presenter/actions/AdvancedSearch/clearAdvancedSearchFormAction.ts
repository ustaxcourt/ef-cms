import { ALL_COUNTRY_TYPE } from '@shared/business/entities/cases/CaseSearch';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears the advanced search form based on the formType passed in via props
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const clearAdvancedSearchFormAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const { ADVANCED_SEARCH_OPINION_TYPES, DATE_RANGE_SEARCH_OPTIONS } =
    applicationContext.getConstants();

  const { formType } = props;
  const defaultForm = {} as {
    countryType?: string;
    keyword?: string;
    dateRange?: string;
    opinionTypes?: {
      [key: string]: boolean;
    };
  };
  if (formType === 'caseSearchByName') {
    defaultForm.countryType = ALL_COUNTRY_TYPE;
  }
  if (formType === 'orderSearch' || formType === 'opinionSearch') {
    defaultForm.keyword = '';
    defaultForm.dateRange = DATE_RANGE_SEARCH_OPTIONS.ALL_DATES;
  }
  if (formType === 'opinionSearch') {
    defaultForm.opinionTypes = {
      [ADVANCED_SEARCH_OPINION_TYPES.Memorandum]: true,
      [ADVANCED_SEARCH_OPINION_TYPES.Summary]: true,
      [ADVANCED_SEARCH_OPINION_TYPES.Bench]: true,
      [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
    };
  }
  store.set(state.advancedSearchForm[formType], defaultForm);
};
