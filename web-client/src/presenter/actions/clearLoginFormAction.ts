import { state } from '@web-client/presenter/app.cerebral';

/**
 * resets the form.
 * state.form is used throughout the app for storing html form values
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting the form
 */
export const clearLoginFormAction = ({ store }: ActionProps) => {
  store.set(state.form, {
    email: '',
  });
};
