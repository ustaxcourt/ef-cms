import { state } from 'cerebral';

/**
 * update a case note
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the details of a caseNote
 */
export const updateCaseNoteAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const caseId = get(state.caseDetail.caseId);
  const { notes } = props;

  const caseNote = await applicationContext
    .getUseCases()
    .updateCaseNoteInteractor({
      applicationContext,
      caseId,
      notes,
    });

  return { caseNote };
};
