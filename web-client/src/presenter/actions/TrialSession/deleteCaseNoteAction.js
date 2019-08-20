/**
 * delete a case note
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the details of a caseNote
 */
export const deleteCaseNoteAction = async ({ applicationContext, props }) => {
  const { caseId } = props;
  let caseNote;

  await applicationContext.getUseCases().deleteCaseNoteInteractor({
    applicationContext,
    caseId,
  });

  return { caseNote };
};
