import { state } from 'cerebral';

/**
 * sets state.screenMetadata.showPractitionerEmailInput to true to display
 * the practitioner email input field
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const showPractitionerEmailInputAction = ({ store }) => {
  store.set(state.screenMetadata.showPractitionerEmailInput, true);
};
