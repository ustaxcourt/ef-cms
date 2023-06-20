import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.setNotifications
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setNotificationsAction = ({ props, store }: ActionProps) => {
  store.set(state.notifications, props.notifications);
};
