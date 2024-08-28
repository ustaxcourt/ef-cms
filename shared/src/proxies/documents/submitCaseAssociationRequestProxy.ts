import { put } from '../requests';

/**
 * submitCaseAssociationRequestInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.filers the list of filers to associate with
 * @param {array}  providers.consolidatedCasesDocketNumbers a list of the docketNumbers on which to file the case association document
 * @returns {Promise<*>} the promise of the api call
 */
export const submitCaseAssociationRequestInteractor = (
  applicationContext,
  {
    docketNumber,
    filers,
    userId,
  }: {
    docketNumber: string;
    userId: string;
    filers?: string[];
  },
) => {
  return put({
    applicationContext,
    body: {
      docketNumber,
      filers,
    },
    endpoint: `/users/${userId}/case/${docketNumber}`,
  });
};
