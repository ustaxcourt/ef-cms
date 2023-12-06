import { state } from '@web-client/presenter/app.cerebral';

/**
 * resets the form and completeForm
 * state.form is used throughout the app for storing html form values
 * state.completeForm used for keeping track of completed html inputs for individual work items
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the form
 */
export const clearFormsAction = ({ store }: ActionProps) => {
  store.set(state.completeForm, {});
  store.set(state.form, {});
};
