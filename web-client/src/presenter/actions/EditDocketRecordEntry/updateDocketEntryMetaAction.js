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
  props,
}) => {
  const { caseId, docketRecordEntry, docketRecordIndex } = props;

  const { servedParties } = docketRecordEntry;

  if (servedParties && typeof servedParties === 'string') {
    docketRecordEntry.servedParties = Array(servedParties);
  }

  await applicationContext.getUseCases().updateDocketEntryMetaInteractor({
    applicationContext,
    caseId,
    docketEntryMeta: docketRecordEntry,
    docketRecordIndex,
  });
};
