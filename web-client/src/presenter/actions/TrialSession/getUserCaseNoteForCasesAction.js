/**
 * Fetches the cases notes
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting cases notes via getUserCaseNoteForCasesInteractor
 * @param {object} providers.props the cerebral props object containing the props.trialSession
 * @returns {object} contains the notes for all cases
 */
export const getUserCaseNoteForCasesAction = async ({
  applicationContext,
  props,
}) => {
  const { trialSession } = props;

  let notes = [];
  if (trialSession.caseOrder.length) {
    notes = await applicationContext
      .getUseCases()
      .getUserCaseNoteForCasesInteractor(applicationContext, {
        docketNumbers: trialSession.caseOrder.map(entry => entry.docketNumber),
      });
  }

  return { notes };
};
