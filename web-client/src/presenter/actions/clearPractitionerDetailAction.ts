import { state } from 'cerebral';

/**
 * sets the state.practitionerDetail to an empty object
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearPractitionerDetailAction = ({ store }) => {
  store.set(state.practitionerDetail, {});
};
