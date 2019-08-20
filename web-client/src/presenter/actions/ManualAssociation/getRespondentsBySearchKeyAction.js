import { state } from 'cerebral';

/* * Gets respondents whose name or barNumber match the searchKey
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getRespondentsBySearchKeyInteractor use case
 * @returns {object} contains the respondents returned from the getRespondentsBySearchKeyInteractor use case
 */
export const getRespondentsBySearchKeyAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const searchKey = get(state.form.respondentSearch);

  const respondents = await applicationContext
    .getUseCases()
    .getRespondentsBySearchKeyInteractor({ applicationContext, searchKey });

  if (respondents.length) {
    return path.success({
      respondents,
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
