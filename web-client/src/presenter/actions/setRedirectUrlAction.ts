import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.redirectUrl from props.redirectUrl
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.redirectUrl
 * @param {object} providers.store the cerebral store used for setting the state.redirectUrl
 */
export const setRedirectUrlAction = ({ props, store }: ActionProps) => {
  store.set(state.redirectUrl, props.redirectUrl);
};
