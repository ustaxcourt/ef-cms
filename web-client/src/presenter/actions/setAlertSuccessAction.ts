import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.alertSuccess based on the props.alertSuccess passed in
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.alertSuccess
 * @param {object} providers.props the cerebral props object used for passing the props.alertSuccess
 */
export const setAlertSuccessAction = ({ props, store }: ActionProps) => {
  store.set(state.alertSuccess, props.alertSuccess);
};
