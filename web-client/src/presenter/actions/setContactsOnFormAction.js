import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * sets state.form.contactPrimary and state.form.contactSecondary from props.caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setContactsOnFormAction = ({
  applicationContext,
  props,
  store,
}) => {
  const caseDetail = cloneDeep(props.caseDetail);

  const contactPrimary = applicationContext
    .getUtilities()
    .getContactPrimary(caseDetail);
  store.set(state.form.contactPrimary, contactPrimary);
  const contactSecondary = applicationContext
    .getUtilities()
    .getContactSecondary(caseDetail);
  store.set(state.form.contactSecondary, contactSecondary);
  store.unset(state.form.petitioners);
};
