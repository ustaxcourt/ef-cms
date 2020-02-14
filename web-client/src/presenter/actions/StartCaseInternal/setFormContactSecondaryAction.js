import { state } from 'cerebral';

/**
 * sets contactSecondary with contact prop
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store
 * @returns {void}
 */
export const setFormContactSecondaryAction = ({ props, store }) => {
  const { contact } = props;

  store.set(state.form.contactSecondary, contact);
};
