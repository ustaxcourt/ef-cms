import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.alertWarning based on the props.alertWarning passed in
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.alertWarning
 * @param {object} providers.props the cerebral props object used for passing the props.alertWarning
 */
export const setAlertWarningAction = ({ props, store }: ActionProps) => {
  store.set(state.alertWarning, props.alertWarning);
};
