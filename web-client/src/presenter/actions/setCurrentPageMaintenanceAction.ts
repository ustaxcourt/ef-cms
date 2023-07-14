import { state } from '@web-client/presenter/app.cerebral';

/**
 * generates an action for setting the page to AppMaintenance
 * @param {string} page the name of the page to set
 * @returns {Promise} async action
 */
export const setCurrentPageMaintenanceAction = async ({
  store,
}: ActionProps) => {
  store.set(state.currentPage, 'AppMaintenance');
  await new Promise(resolve => {
    setTimeout(resolve, 0);
  });
};
