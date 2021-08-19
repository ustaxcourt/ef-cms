/**
 * update a user's case note
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the details of a caseNote
 */
export const updateUserCaseNoteAction = async ({
  applicationContext,
  props,
}) => {
  const { docketNumber, notes } = props;

  const userNote = await applicationContext
    .getUseCases()
    .updateUserCaseNoteInteractor(applicationContext, {
      docketNumber,
      notes,
    });

  return { userNote };
};
