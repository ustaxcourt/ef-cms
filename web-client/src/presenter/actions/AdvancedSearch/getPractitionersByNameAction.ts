import { state } from '@web-client/presenter/app.cerebral';

/* gets practitioners matching the name
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get cerebral get function
 * @returns {object} contains the practitioners returned from the getPractitionersByNameInteractor use case
 */
export const getPractitionersByNameAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { practitionerName } = get(
    state.advancedSearchForm.practitionerSearchByName,
  );

  const practitioners = await applicationContext
    .getUseCases()
    .getPractitionersByNameInteractor(applicationContext, {
      name: practitionerName,
    });

  return { searchResults: practitioners };
};
