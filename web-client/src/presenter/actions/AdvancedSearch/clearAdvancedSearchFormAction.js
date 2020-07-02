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
  const { formType } = props;
  const emptyForm = {};
  if (formType === 'caseSearchByName') {
    const { COUNTRY_TYPES } = applicationContext.getConstants();
    emptyForm.countryType = COUNTRY_TYPES.DOMESTIC;
  }
  if (formType === 'orderSearch' || formType === 'opinionSearch') {
    emptyForm.keyword = '';
  }
  if (formType === 'opinionSearch') {
    emptyForm.keyword = '';
  }
  store.set(state.advancedSearchForm[formType], emptyForm);
};
