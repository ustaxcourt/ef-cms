import { state } from 'cerebral';

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

  caseDetail.petitioners.forEach(petitioner => {
    petitionerAddresses[petitioner.contactId] = petitioner.address1;
    if (petitioner.address2) {
      petitionerAddresses[petitioner.contactId] += ', ' + petitioner.address2;
    }
    if (petitioner.address3) {
      petitionerAddresses[petitioner.contactId] += ', ' + petitioner.address3;
    }
  });

  store.set(state.screenMetadata.petitionerAddresses, petitionerAddresses);
};
