import { state } from 'cerebral';

/* * Gets irsPractitioners whose name or barNumber match the searchKey
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getIrsPractitionersBySearchKeyInteractor use case
 * @returns {object} contains the irsPractitioners returned from the getIrsPractitionersBySearchKeyInteractor use case
 */
export const getIrsPractitionersBySearchKeyAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const searchKey = get(state.form.respondentSearch);

  const irsPractitioners = await applicationContext
    .getUseCases()
    .getIrsPractitionersBySearchKeyInteractor(applicationContext, {
      searchKey,
    });

  if (irsPractitioners.length) {
    return path.success({
      irsPractitioners,
    });
  } else {
    return path.error({
      errors: {
        respondentSearchError:
          'No matching counsel was found. Check your information and try again.',
      },
    });
  }
};
