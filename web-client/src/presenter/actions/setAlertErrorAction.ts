import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.alertError which is used for displaying the red alerts at the top of the page.
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.alertError
 * @param {object} providers.store the cerebral store used for setting the state.alertError
 */
export const setAlertErrorAction = ({ props, store }: ActionProps) => {
  store.set(state.alertError, props.alertError);
};
