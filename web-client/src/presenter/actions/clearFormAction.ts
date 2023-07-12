import { state } from '@web-client/presenter/app.cerebral';

/**
 * resets the state.form which is used throughout the app for storing html form values
 * state.form is used throughout the app for storing html form values
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the form
 */
export const clearFormAction = ({ store }: ActionProps) => {
  store.set(state.form, {});
};
