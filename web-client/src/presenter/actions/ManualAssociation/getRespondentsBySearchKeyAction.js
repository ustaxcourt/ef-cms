import { state } from 'cerebral';

/* * Gets irsPractitioners whose name or barNumber match the searchKey
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getRespondentsBySearchKeyInteractor use case
 * @returns {object} contains the irsPractitioners returned from the getRespondentsBySearchKeyInteractor use case
 */
export const getRespondentsBySearchKeyAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const searchKey = get(state.form.respondentSearch);

  const irsPractitioners = await applicationContext
    .getUseCases()
    .getRespondentsBySearchKeyInteractor({ applicationContext, searchKey });

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
