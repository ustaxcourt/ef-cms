import { state } from 'cerebral';

/* * Gets privatePractitioners whose name or barNumber match the searchKey
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getPractitionersBySearchKeyInteractor use case
 * @returns {object} contains the privatePractitioners returned from the getPractitionersBySearchKeyInteractor use case
 */
export const getPractitionersBySearchKeyAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const searchKey = get(state.form.practitionerSearch);

  const privatePractitioners = await applicationContext
    .getUseCases()
    .getPractitionersBySearchKeyInteractor({ applicationContext, searchKey });

  if (privatePractitioners.length) {
    return path.success({
      privatePractitioners,
    });
  } else {
    return path.error({
      errors: {
        practitionerSearchError:
          'No matching counsel was found. Check your information and try again.',
      },
    });
  }
};
