/**
 * update a case note
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the details of a caseNote
 */
export const updateCaseNoteAction = async ({ applicationContext, props }) => {
  const { caseId, notes } = props;

  const caseNote = await applicationContext
    .getUseCases()
    .updateCaseNoteInteractor({
      applicationContext,
      caseId,
      notes,
    });

  return { caseNote };
};
