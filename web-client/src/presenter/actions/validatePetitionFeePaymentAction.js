import { isEmpty } from 'lodash';
import { state } from 'cerebral';

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

  // TODO: There needs to be a better way to deal with validation / preprocessing all these 3 separate date input fields
  // THIS IS MESSY

  if (form.petitionPaymentStatus === paymentStatus.PAID) {
    // payment date is required
    // payment note is required
  } else if (form.petitionPaymentStatus === paymentStatus.WAIVED) {
    // waived date is required
    if (!form.paymentDateWaivedMonth)
      errors.paymentDateWaivedMonth = 'You must provide a valid month';
    if (!form.paymentDateWaivedDay)
      errors.paymentDateWaivedDay = 'You must provide a valid day';
    if (!form.paymentDateWaivedYear)
      errors.paymentDateWaivedYear = 'You must provide a valid year';
  } else {
    // do nothing?
  }

  if (isEmpty(errors)) {
    const petitionPaymentWaivedDate = applicationContext
      .getUtilities()
      .createISODateString(
        `${form.paymentDateWaivedYear}-${form.paymentDateWaivedMonth}-${form.paymentDateWaivedDay}`,
        'YYYY-MM-DD',
      );
    store.set(
      state.form.petitionPaymentWaivedDate,
      new Date(petitionPaymentWaivedDate),
    );
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
