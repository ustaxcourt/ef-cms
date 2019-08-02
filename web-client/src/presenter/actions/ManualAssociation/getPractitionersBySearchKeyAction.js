import { state } from 'cerebral';

/* * Gets practitioners whose name or barNumber match the searchKey
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getPractitionersBySearchKeyInteractor use case
 * @returns {object} contains the practitioners returned from the getPractitionersBySearchKeyInteractor use case
 */
export const getPractitionersBySearchKeyAction = async ({
  applicationContext,
  get,
}) => {
  const searchKey = get(state.form.practitionerSearch);

  const practitioners = await applicationContext
    .getUseCases()
    .getPractitionersBySearchKeyInteractor({ applicationContext, searchKey });

  return { practitioners };
};
