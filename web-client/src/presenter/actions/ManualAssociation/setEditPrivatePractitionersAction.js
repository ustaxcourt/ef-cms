import { cloneDeep } from 'lodash';
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
export const setEditPrivatePractitionersAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const modalPrivatePractitioners = cloneDeep(caseDetail.privatePractitioners);
  const contactPrimary = applicationContext
    .getUtilities()
    .getContactPrimary(caseDetail);
  const contactSecondary = applicationContext
    .getUtilities()
    .getContactSecondary(caseDetail);

  modalPrivatePractitioners.forEach(privatePractitioner => {
    privatePractitioner.representingPrimary = !!privatePractitioner.representing.find(
      r => r === contactPrimary.contactId,
    );
    privatePractitioner.representingSecondary =
      !!contactSecondary &&
      !!privatePractitioner.representing.find(
        r => r === contactSecondary.contactId,
      );
  });

  store.set(state.modal.privatePractitioners, modalPrivatePractitioners);
};
