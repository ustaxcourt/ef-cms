import { state } from 'cerebral';

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

  if (docketEntry.receivedAt) {
    const receivedAt = applicationContext
      .getUtilities()
      .prepareDateFromString(docketEntry.receivedAt);

    if (
      receivedAt &&
      receivedAt.toDate() instanceof Date &&
      receivedAt.isValid()
    ) {
      store.set(state.form.dateReceivedMonth, receivedAt.format('M'));
      store.set(state.form.dateReceivedDay, receivedAt.format('D'));
      store.set(state.form.dateReceivedYear, receivedAt.format('YYYY'));
    }
  }

  if (docketEntry.serviceDate) {
    const serviceDate = applicationContext
      .getUtilities()
      .prepareDateFromString(docketEntry.serviceDate);

    if (
      serviceDate &&
      serviceDate.toDate() instanceof Date &&
      serviceDate.isValid()
    ) {
      store.set(state.form.month, serviceDate.format('M'));
      store.set(state.form.day, serviceDate.format('D'));
      store.set(state.form.year, serviceDate.format('YYYY'));
    }
  }

  if (
    docketEntry.secondaryDocument &&
    docketEntry.secondaryDocument.serviceDate
  ) {
    const serviceDate = applicationContext
      .getUtilities()
      .prepareDateFromString(docketEntry.secondaryDocument.serviceDate);

    if (
      serviceDate &&
      serviceDate.toDate() instanceof Date &&
      serviceDate.isValid()
    ) {
      store.set(state.form.secondaryDocument.month, serviceDate.format('M'));
      store.set(state.form.secondaryDocument.day, serviceDate.format('D'));
      store.set(state.form.secondaryDocument.year, serviceDate.format('YYYY'));
    }
  }

  if (docketEntry.certificateOfServiceDate) {
    const certificateOfServiceDate = applicationContext
      .getUtilities()
      .prepareDateFromString(docketEntry.certificateOfServiceDate);

    if (
      certificateOfServiceDate &&
      certificateOfServiceDate.toDate() instanceof Date &&
      certificateOfServiceDate.isValid()
    ) {
      store.set(
        state.form.certificateOfServiceMonth,
        certificateOfServiceDate.format('M'),
      );
      store.set(
        state.form.certificateOfServiceDay,
        certificateOfServiceDate.format('D'),
      );
      store.set(
        state.form.certificateOfServiceYear,
        certificateOfServiceDate.format('YYYY'),
      );
    }
  }
};
