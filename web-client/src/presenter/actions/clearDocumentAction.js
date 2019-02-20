import { state } from 'cerebral';

/**
 * Resets the state.document back to defaults.  state.document is where we store the files uploaded
 * when staring a case or uploading a document.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing document
 */
export default ({ store }) => {
  store.set(state.document, {
    file: null,
    uploadsFinished: 0,
  });
};
