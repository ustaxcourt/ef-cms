import { cloneDeep } from 'lodash';
import { getContactSecondary } from '../../../../shared/src/business/entities/cases/Case';
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
  const { CONTACT_TYPES } = applicationContext.getConstants();

  store.set(state.form, { contact: {} });

  const caseDetail = cloneDeep(get(state.caseDetail));
  const contactSecondary = getContactSecondary(caseDetail);

  if (!contactSecondary) {
    store.set(state.form.contact.contactType, CONTACT_TYPES.secondary);
  } else {
    store.set(state.form.contact.contactType, CONTACT_TYPES.otherPetitioner);
  }

  store.set(state.form.caseCaption, caseDetail.caseCaption);
};
