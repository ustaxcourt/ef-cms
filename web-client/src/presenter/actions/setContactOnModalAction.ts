import { state } from 'cerebral';

/**
 * sets the private practitioner onto the modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting showModal
 * @param {object} providers.props the cerebral props
 */
export const setContactOnModalAction = ({ props, store }) => {
  store.set(state.modal.contact, props.privatePractitioner);
};
