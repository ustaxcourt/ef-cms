import { applicationContext } from '@web-client/applicationContext';
import { get } from './requests';

/**
 * getIsFiledAcrossAllCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the docket entry id to check
 * @returns {Promise<*>} the promise of the api call
 */
export const getIsFiledAcrossAllCasesInteractor = ({
  docketEntryId,
}: {
  docketEntryId: string;
}): Promise<boolean> => {
  return get({
    applicationContext,
    endpoint: `/case-documents/${docketEntryId}/is-filed-across-all-cases`,
  });
};
