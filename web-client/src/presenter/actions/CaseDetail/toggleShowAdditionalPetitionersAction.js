import { state } from 'cerebral';

/**
 * sets state.showingAdditionalPetitioners its negated stored value (default false)
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store function
 */
export const toggleShowAdditionalPetitionersAction = ({ get, store }) => {
  const showingAdditionalPetitioners =
    get(state.showingAdditionalPetitioners) || false;

  store.set(state.showingAdditionalPetitioners, !showingAdditionalPetitioners);
};
