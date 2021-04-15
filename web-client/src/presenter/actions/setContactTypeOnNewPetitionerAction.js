import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { getContactSecondary } from '../../../../shared/src/business/entities/cases/Case';
import { state } from 'cerebral';

/**
 * todo 5386
 * Validates petitioner information and redirects user to success or error path
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.store the cerebral store object
 */
export const setContactTypeOnNewPetitionerAction = ({ get, store }) => {
  const caseDetail = get(state.caseDetail);
  const contactSecondary = getContactSecondary(caseDetail);

  if (!contactSecondary) {
    store.set(state.form.contactType, CONTACT_TYPES.secondary);
  } else {
    store.set(state.form.contactType, CONTACT_TYPES.otherPetitioner);
  }
};
