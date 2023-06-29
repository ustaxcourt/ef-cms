import { makeMap } from '../../computeds/makeMap';
import { state } from '@web-client/presenter/app.cerebral';

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.calendaredCases
 */
export const updateCalendaredCaseUserNoteAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const calendaredCases = get(state.trialSession.calendaredCases);
  const { userNote } = props;
  const caseToUpdate = calendaredCases.find(
    aCase => aCase.docketNumber === userNote.docketNumber,
  );
  caseToUpdate.notes = userNote;

  let userNotes = [];
  for (const calendaredCase of calendaredCases) {
    userNotes.push(calendaredCase.notes);
  }
  store.set(
    state.trialSessionWorkingCopy.userNotes,
    makeMap(userNotes, 'docketNumber'),
  );
};
