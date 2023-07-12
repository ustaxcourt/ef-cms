import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets state.screenMetadata.showPractitionerEmailInput to true to display
 * the practitioner email input field
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const showPractitionerEmailInputAction = ({ store }: ActionProps) => {
  store.set(state.screenMetadata.showPractitionerEmailInput, true);
};
