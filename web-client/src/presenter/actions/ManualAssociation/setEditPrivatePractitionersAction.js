import { cloneDeep } from 'lodash';
import { getContactPrimary } from '../../../../../shared/src/business/entities/cases/Case';
import { state } from 'cerebral';

/**
 * sets up the modal state for the Edit Practitioners modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.store the cerebral store object
 * @returns {Promise<*>} the promise of the completed action
 */
export const setEditPrivatePractitionersAction = async ({ get, store }) => {
  const caseDetail = get(state.caseDetail);
  const modalPrivatePractitioners = cloneDeep(caseDetail.privatePractitioners);
  const contactPrimary = getContactPrimary(caseDetail);

  modalPrivatePractitioners.forEach(privatePractitioner => {
    privatePractitioner.representingPrimary = !!privatePractitioner.representing.find(
      r => r === contactPrimary.contactId,
    );
    privatePractitioner.representingSecondary =
      !!caseDetail.contactSecondary &&
      !!privatePractitioner.representing.find(
        r => r === caseDetail.contactSecondary.contactId,
      );
  });

  store.set(state.modal.privatePractitioners, modalPrivatePractitioners);
};
