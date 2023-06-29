import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets the title for the screen
 *
 * @param {string} headerTitle the name of the header title
 * @returns {Promise} async action
 */
export const setTitleForGlobalReportFactoryAction =
  headerTitle =>
  /**
   * sets the state.screenMetaData.headerTitle
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store used for setting the state.screenMetadata.headerTitle
   */
  ({ store }: ActionProps) => {
    store.set(state.screenMetadata.headerTitle, headerTitle);
  };
