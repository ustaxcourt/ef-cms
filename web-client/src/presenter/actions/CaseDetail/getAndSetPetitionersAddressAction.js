import { state } from 'cerebral';
import { uniqBy } from 'lodash';

/**
 * gets and sets state.screenMetadata.petitionerAddresses
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store function
 */
export const getAndSetPetitionersAddressAction = ({ get, store }) => {
  const caseDetail = get(state.caseDetail);

  const petitionerAddresses = {};

  const uniquePetitionerAddresses = uniqBy(
    caseDetail.petitioners,
    contact => `${contact.address1} ${contact.address2} ${contact.address3}`,
  );

  uniquePetitionerAddresses.forEach(petitioner => {
    petitionerAddresses[petitioner.contactId] = [
      petitioner.address1,
      petitioner.address2,
      petitioner.address3,
    ]
      .filter(Boolean)
      .join(', ');
  });

  store.set(state.screenMetadata.petitionerAddresses, petitionerAddresses);
};
