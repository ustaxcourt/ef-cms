import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * sets the state.form with an empty contact object
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setDefaultAddPetitionerToCaseFormAction = ({
  applicationContext,
  get,
  store,
}) => {
  const { COUNTRY_TYPES } = applicationContext.getConstants();

  store.set(state.form, { contact: {} });

  const caseDetail = cloneDeep(get(state.caseDetail));

  store.set(state.form.contact.countryType, COUNTRY_TYPES.DOMESTIC);
  store.set(state.form.contact.caseCaption, caseDetail.caseCaption);
  store.set(state.form.useExistingAddress, false);
};
