import { makeMap } from '../../computeds/makeMap';
import { state } from 'cerebral';

/**
 * sets the state.trialSession.calendaredCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.calendaredCases
 */
export const extractNotesFromCalendaredCasesAction = ({ get, store }) => {
  const calendaredCases = get(state.trialSession.calendaredCases);
  let caseNotes = [];

  for (const calendaredCase of calendaredCases) {
    caseNotes.push(calendaredCase.notes);
  }
  store.set(
    state.trialSessionWorkingCopy.caseNotes,
    makeMap(caseNotes, 'caseId'),
  );
};
