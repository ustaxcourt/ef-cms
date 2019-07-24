import { state } from 'cerebral';

/**
 * clears the petition on state
 * state.petition is used for holding the files associated with starting a case and any files related to the petition
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting petition
 */
export const clearPetitionAction = ({ store }) => {
  store.set(state.petition, {
    petitionFile: null,
    uploadsFinished: 0,
  });
};
