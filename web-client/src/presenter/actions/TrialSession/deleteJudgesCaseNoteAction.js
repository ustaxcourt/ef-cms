/**
 * delete a judge's case note
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the details of a caseNote
 */
export const deleteJudgesCaseNoteAction = async ({
  applicationContext,
  props,
}) => {
  const { caseId, trialSessionId } = props;

  await applicationContext.getUseCases().deleteJudgesCaseNoteInteractor({
    applicationContext,
    caseId,
  });

  return {
    judgesNote: {
      caseId,
      trialSessionId,
    },
  };
};
