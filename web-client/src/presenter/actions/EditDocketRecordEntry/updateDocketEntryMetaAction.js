import { state } from 'cerebral';

/**
 * update props from modal state to pass to through sequence
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the utility method
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the new props
 */
export const updateDocketEntryMetaAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const { caseId } = get(state.caseDetail);
  const docketRecordEntry = get(state.form);
  const docketRecordIndex = get(state.docketRecordIndex);

  try {
    await applicationContext.getUseCases().updateDocketEntryMetaInteractor({
      applicationContext,
      caseId,
      docketEntryMeta: docketRecordEntry,
      docketRecordIndex,
    });
    return path.success();
  } catch (err) {
    return path.error({
      alertError: {
        message: err.message,
        title: 'Error',
      },
    });
  }
};
