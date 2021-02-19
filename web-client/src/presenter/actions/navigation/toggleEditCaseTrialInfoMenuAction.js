import { state } from 'cerebral';

/**
 * Toggles visibility of expanded edit case trial information menu
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @param {object} providers.store the cerebral store object used for setting or unsetting open menu
 */
export const toggleEditCaseTrialInfoMenuAction = ({ get, props, store }) => {
  const editCaseTrialInfoMenu = get(state.navigation.editCaseTrialInfoMenu);
  if (editCaseTrialInfoMenu === props.editCaseTrialInfoMenu) {
    store.unset(state.navigation.editCaseTrialInfoMenu);
  } else {
    store.set(
      state.navigation.editCaseTrialInfoMenu,
      props.editCaseTrialInfoMenu,
    );
  }
};
