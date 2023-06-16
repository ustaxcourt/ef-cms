import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.practitionerDetail to an empty object
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearPractitionerDetailAction = ({ store }: ActionProps) => {
  store.set(state.practitionerDetail, {});
};
