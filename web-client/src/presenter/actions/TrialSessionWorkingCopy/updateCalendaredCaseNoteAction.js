import { makeMap } from '../../computeds/makeMap';
import { state } from 'cerebral';

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.calendaredCases
 */
export const updateCalendaredCaseNoteAction = ({ get, props, store }) => {
  const calendaredCases = get(state.trialSession.calendaredCases);
  const { caseNote } = props;
  const caseToUpdate = calendaredCases.find(
    aCase => aCase.caseId === caseNote.caseId,
  );
  caseToUpdate.notes = caseNote;

  let caseNotes = [];
  for (const calendaredCase of calendaredCases) {
    caseNotes.push(calendaredCase.notes);
  }
  store.set(
    state.trialSessionWorkingCopy.caseNotes,
    makeMap(caseNotes, 'caseId'),
  );
};
