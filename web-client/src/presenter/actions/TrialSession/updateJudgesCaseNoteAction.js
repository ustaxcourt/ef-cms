/**
 * update a judge's case note
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the details of a caseNote
 */
export const updateJudgesCaseNoteAction = async ({
  applicationContext,
  props,
}) => {
  const { caseId, notes } = props;

  const judgesNote = await applicationContext
    .getUseCases()
    .updateJudgesCaseNoteInteractor({
      applicationContext,
      caseId,
      notes,
    });

  return { judgesNote };
};
