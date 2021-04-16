import { state } from 'cerebral';

/**
 * gets state.getPetitionersAddressAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store function
 */
export const getAndSetPetitionersAddressAction = ({ get, store }) => {
  // GO BACK AND DO A TEST
  const caseDetail = get(state.caseDetail);

  const petitioners = {};

  caseDetail.petitioners?.map(petitioner => {
    petitioner.address1;
  });

  // result object will look like: contactId: address1
  // { '2344-2asdvfxfd': 1234 main st' }
};
