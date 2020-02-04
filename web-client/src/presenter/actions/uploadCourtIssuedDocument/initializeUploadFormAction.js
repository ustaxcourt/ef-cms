import { state } from 'cerebral';

/**
 * initialize the form for upload pdf
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const initializeUploadFormAction = ({ store }) => {
  store.set(state.form, {
    category: 'Miscellaneous',
    documentTitle: '[anything]',
    documentType: 'MISC - Miscellaneous',
    eventCode: 'MISC',
    scenario: 'Type A',
  });
};
