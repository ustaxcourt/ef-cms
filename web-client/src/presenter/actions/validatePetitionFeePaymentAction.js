import { isEmpty } from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';

/**
 * validate the case or session note
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validatePetitionFeePaymentAction = ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const form = get(state.form);
  const paymentStatus = get(state.constants.PAYMENT_STATUS);

  let errors = {};

  if (form.petitionPaymentStatus === paymentStatus.PAID) {
    // payment note is required
    if (!form.petitionPaymentMethod) {
      errors.petitionPaymentMethod = 'You must provide a valid payment method';
    }

    if (
      !applicationContext
        .getUtilities()
        .isValidDateString(
          `${form.paymentDateMonth}-${form.paymentDateDay}-${form.paymentDateYear}`,
        )
    ) {
      errors.paymentDate = 'Enter a valid date payment date';
    }
  } else if (form.petitionPaymentStatus === paymentStatus.WAIVED) {
    if (
      !applicationContext
        .getUtilities()
        .isValidDateString(
          `${form.paymentDateWaivedMonth}-${form.paymentDateWaivedDay}-${form.paymentDateWaivedYear}`,
        )
    ) {
      errors.paymentDateWaived = 'Enter a valid payment waived date';
    }
  }

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        messages: Object.values(errors),
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }
};
