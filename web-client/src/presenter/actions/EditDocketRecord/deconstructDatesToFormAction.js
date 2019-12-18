import { state } from 'cerebral';

export const deconstructDate = (dateString, { applicationContext }) => {
  const momentObj =
    dateString &&
    applicationContext.getUtilities().prepareDateFromString(dateString);
  let result;
  if (momentObj && momentObj.toDate() instanceof Date && momentObj.isValid()) {
    result = {
      day: momentObj.format('D'),
      month: momentObj.format('M'),
      year: momentObj.format('YYYY'),
    };
  }
  return result;
};

/**
 * takes a date from a docket entry and create separate form inputs
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store used for setting the state.form
 */
export const deconstructDatesToFormAction = async ({
  applicationContext,
  props,
  store,
}) => {
  const { docketEntry } = props;
  let formDate;

  if (
    (formDate = deconstructDate(docketEntry.receivedAt, { applicationContext }))
  ) {
    store.set(state.form.dateReceivedMonth, formDate.month);
    store.set(state.form.dateReceivedDay, formDate.day);
    store.set(state.form.dateReceivedYear, formDate.year);
  }

  if (
    (formDate = deconstructDate(docketEntry.serviceDate, {
      applicationContext,
    }))
  ) {
    store.set(state.form.month, formDate.month);
    store.set(state.form.day, formDate.day);
    store.set(state.form.year, formDate.year);
  }

  if (
    (formDate = deconstructDate(
      docketEntry.secondaryDocument &&
        docketEntry.secondaryDocument.serviceDate,
      {
        applicationContext,
      },
    ))
  ) {
    store.set(state.form.secondaryDocument.month, formDate.month);
    store.set(state.form.secondaryDocument.day, formDate.day);
    store.set(state.form.secondaryDocument.year, formDate.year);
  }

  if (
    (formDate = deconstructDate(docketEntry.certificateOfServiceDate, {
      applicationContext,
    }))
  ) {
    store.set(state.form.certificateOfServiceMonth, formDate.month);
    store.set(state.form.certificateOfServiceDay, formDate.day);
    store.set(state.form.certificateOfServiceYear, formDate.year);
  }
};
