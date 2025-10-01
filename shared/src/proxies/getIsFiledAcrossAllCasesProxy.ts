import { get } from './requests';

/**
 * getIsFiledAcrossAllCasesInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the docket entry id to check
 * @returns {Promise<*>} the promise of the api call
 */
export const getIsFiledAcrossAllCasesInteractor = (
  applicationContext,
  {
    docketEntryId,
  }: { docketEntryId: string },
) => {
  return get({
    applicationContext,
    endpoint: `/case-documents/${docketEntryId}/is-filed-across-all-cases`,
  });
};
