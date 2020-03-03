import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * sets contactSecondary with contact prop
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store
 * @returns {void}
 */
export const setFormContactSecondaryAddressAction = ({ get, props, store }) => {
  const { contact } = props;
  // overwrite everything but the name
  store.set(state.form.contactSecondary, {
    inCareOf: get(state.form.contactSecondary.inCareOf),
    name: get(state.form.contactSecondary.name),
    ...omit(contact, ['name']),
  });
};
