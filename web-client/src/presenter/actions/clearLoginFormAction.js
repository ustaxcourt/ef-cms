import { state } from 'cerebral';

/**
 * resets the form.
 * state.form is used throughout the app for storing html form values
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for setting the form
 */
export default ({ store }) => {
  store.set(state.form, {
    name: '',
  });
};
