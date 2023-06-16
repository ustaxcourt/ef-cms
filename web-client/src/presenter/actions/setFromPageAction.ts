import { state } from '@web-client/presenter/app.cerebral';

/**
 * tracks the page we were previous on
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the form
 */
export const setFromPageAction = ({ props, store }: ActionProps) => {
  store.set(state.fromPage, props.fromPage);
};
