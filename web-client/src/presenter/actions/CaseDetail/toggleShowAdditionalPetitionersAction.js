import { state } from 'cerebral';

/**
 * sets props.blockedCases on state.blockedCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the props object
 * @param {Function} providers.store the cerebral store function
 */
export const toggleShowAdditionalPetitionersAction = async ({ get, store }) => {
  const showingAdditionalPetitioners =
    get(state.showingAdditionalPetitioners) || false;

  store.set(state.showingAdditionalPetitioners, !showingAdditionalPetitioners);
};
