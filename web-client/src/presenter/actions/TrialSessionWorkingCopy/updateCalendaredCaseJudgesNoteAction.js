import { makeMap } from '../../computeds/makeMap';
import { state } from 'cerebral';

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.calendaredCases
 */
export const updateCalendaredCaseJudgesNoteAction = ({ get, props, store }) => {
  const calendaredCases = get(state.trialSession.calendaredCases);
  const { judgesNote } = props;
  const caseToUpdate = calendaredCases.find(
    aCase => aCase.caseId === judgesNote.caseId,
  );
  caseToUpdate.notes = judgesNote;

  let judgesNotes = [];
  for (const calendaredCase of calendaredCases) {
    judgesNotes.push(calendaredCase.notes);
  }
  store.set(
    state.trialSessionWorkingCopy.judgesNotes,
    makeMap(judgesNotes, 'caseId'),
  );
};
