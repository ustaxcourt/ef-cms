import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * validates the irsPractitioners on the modal form for the edit counsel modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.get the cerebral get function used for getting state.modal
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateEditIrsPractitionersAction = ({
  applicationContext,
  get,
  path,
}) => {
  let SERVICE_INDICATOR_TYPES;

  ({ SERVICE_INDICATOR_TYPES } = applicationContext.getConstants());

  const { irsPractitioners } = get(state.modal);
  const { irsPractitioners: oldRespondents } = get(state.caseDetail);

  const serviceIndicatorError =
    'You cannot change from paper to electronic service. Select a valid service preference.';

  const errors = [];
  irsPractitioners.forEach(respondent => {
    const error = {};
    const oldRespondent = oldRespondents.find(
      foundRespondent => foundRespondent.userId === respondent.userId,
    );
    if (
      [
        SERVICE_INDICATOR_TYPES.SI_PAPER,
        SERVICE_INDICATOR_TYPES.SI_NONE,
      ].includes(oldRespondent.serviceIndicator) &&
      respondent.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_ELECTRONIC
    ) {
      error.serviceIndicator = serviceIndicatorError;
    }

    errors.push(error);
  });

  if (errors.filter(item => !isEmpty(item)).length === 0) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors: { irsPractitioners: errors },
    });
  }
};
