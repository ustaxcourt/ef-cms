import { state } from 'cerebral';

/**
 * Sets the title for the screen
 *
 * @param {object} providers.store the cerebral store object used for setting headerTitle
 */
export const setTitleForPrintableTrialSessionWorkingCopyAction = ({
  store,
}) => {
  store.set(
    state.screenMetadata.headerTitle,
    'Trial Session Printable Working Copy',
  );
};
