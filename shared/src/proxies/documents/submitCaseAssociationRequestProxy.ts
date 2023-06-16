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
  { consolidatedCasesDocketNumbers, docketNumber, filers },
) => {
  const user = applicationContext.getCurrentUser();
  return put({
    applicationContext,
    body: {
      consolidatedCasesDocketNumbers,
      docketNumber,
      filers,
    },
    endpoint: `/users/${user.userId}/case/${docketNumber}`,
  });
};
