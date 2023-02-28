import { state } from 'cerebral';

/**
 * clears the advanced search form based on the formType passed in via props
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const clearAdvancedSearchFormAction = ({
  applicationContext,
  props,
  store,
}) => {
  const {
    ADVANCED_SEARCH_OPINION_TYPES,
    COUNTRY_TYPES,
    DATE_RANGE_SEARCH_OPTIONS,
  } = applicationContext.getConstants();

  const { formType } = props;
  const defaultForm = {};
  if (formType === 'caseSearchByName') {
    defaultForm.countryType = COUNTRY_TYPES.DOMESTIC;
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
