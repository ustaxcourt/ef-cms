import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * validates the respondent on the form for the edit counsel page
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateEditRespondentCounselAction = ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const { SERVICE_INDICATOR_ERROR, SERVICE_INDICATOR_TYPES } =
    applicationContext.getConstants();

  const respondentCounsel = get(state.form);
  const { irsPractitioners: oldRespondentCounsels } = get(state.caseDetail);

  let errors = {};
  const oldRespondentCounsel = oldRespondentCounsels.find(
    foundRespondent => foundRespondent.userId === respondentCounsel.userId,
  );
  if (
    [
      SERVICE_INDICATOR_TYPES.SI_PAPER,
      SERVICE_INDICATOR_TYPES.SI_NONE,
    ].includes(oldRespondentCounsel.serviceIndicator) &&
    respondentCounsel.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_ELECTRONIC
  ) {
    errors = {
      ...errors,
      ...SERVICE_INDICATOR_ERROR,
    };
  }

  store.set(state.validationErrors, errors);

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }
};
