import { isSealedCase } from '../../entities/cases/Case';

/**
 * isCaseVisibleToPublic
 * Looks up a case from persistence to inspect it and determine whether
 * it should be regarded as sealed, and therefore not visible to public users
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of a case
 * @returns {boolean} whether case ought to be visible to public
 */
export const isCaseVisibleToPublic = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}) => {
  const caseDetails = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });
  return !isSealedCase(caseDetails);
};

/**
 * filterForPublic
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.unfiltered an array of objects with a docketNumber property
 * @returns {array} the list of objects which ought to be visible to the public user
 */
export const filterForPublic = async ({
  applicationContext,
  unfiltered,
}: {
  applicationContext: IApplicationContext;
  unfiltered: any[];
}) => {
  const filtered = [];
  for (const result of unfiltered) {
    if (
      await exports.isCaseVisibleToPublic({
        applicationContext,
        docketNumber: result.docketNumber,
      })
    ) {
      filtered.push(result);
    }
  }
  return filtered;
};
