import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.saveAlertsForNavigation to true which is used for persisting alerts after navigation
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting the state.saveAlertsForNavigation
 */
export const setSaveAlertsForNavigationAction = ({ store }: ActionProps) => {
  store.set(state.saveAlertsForNavigation, true);
};
