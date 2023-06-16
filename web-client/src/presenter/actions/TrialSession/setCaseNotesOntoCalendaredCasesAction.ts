import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.trialSession.calendaredCases
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object containing the props.calendaredCases
 * @param {object} providers.store the cerebral store used for setting the state.calendaredCases
 */
export const setCaseNotesOntoCalendaredCasesAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const calendaredCases = get(state.trialSession.calendaredCases);
  for (const note of props.notes) {
    const calendaredCase = calendaredCases.find(
      foundCalendaredCase =>
        foundCalendaredCase.docketNumber === note.docketNumber,
    );
    Object.assign(calendaredCase, {
      notes: note,
    });
  }
  store.set(state.trialSession.calendaredCases, calendaredCases);
};
