import { state } from '@web-client/presenter/app.cerebral';

/**
 * update props from modal state to pass to through sequence
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the utility method
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new props
 */
export const primePropsFromEditDocketEntryMetaModalAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const docketRecordEntry = applicationContext
    .getUtilities()
    .filterEmptyStrings(get(state.form));

  const docketNumber = get(state.caseDetail.docketNumber);
  const docketRecordIndex = docketRecordEntry.index;
  return { docketNumber, docketRecordEntry, docketRecordIndex };
};
