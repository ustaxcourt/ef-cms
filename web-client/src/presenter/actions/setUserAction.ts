import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.user to the props.users passed in.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.user
 * @param {object} providers.props the cerebral props object used for getting the props.user
 */
export const setUserAction = ({ props, store }: ActionProps) => {
  store.set(state.user, props.user);
};
