import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the value of state.form.partyType
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {void} sets the documentToEdit on state
 */
export const setPartyTypeAction = ({ props, store }: ActionProps) => {
  store.set(state.form.partyType, props.value);
};
