import { state } from '@web-client/presenter/app.cerebral';

/**
 * resets the state.navigation.caseDetailMenu
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the form
 */
export const clearCaseDetailMenuAction = ({ store }: ActionProps) => {
  store.unset(state.navigation.caseDetailMenu);
};
