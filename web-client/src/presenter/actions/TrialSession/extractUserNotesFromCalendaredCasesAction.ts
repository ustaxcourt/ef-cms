import { makeMap } from '../../computeds/makeMap';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * runs through all the calendared cases to recreate the userNotes mapping
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function used for getting values from the state
 * @param {object} providers.store the cerebral store used for setting the state.calendaredCases
 */
export const extractUserNotesFromCalendaredCasesAction = ({
  get,
  store,
}: ActionProps) => {
  const calendaredCases = get(state.trialSession.calendaredCases);
  let userNotes = [];

  for (const calendaredCase of calendaredCases) {
    userNotes.push(calendaredCase.notes);
  }
  store.set(
    state.trialSessionWorkingCopy.userNotes,
    makeMap(userNotes, 'docketNumber'),
  );
};
