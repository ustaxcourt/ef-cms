import { state } from 'cerebral';

/**
 * computes the certificate of service dates from the form
 * month, day and year values
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 */
export const computeCertificateOfServiceFormDateAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  let month = get(state.form.certificateOfServiceMonth);
  let day = get(state.form.certificateOfServiceDay);
  let year = get(state.form.certificateOfServiceYear);
  store.set(
    state.form.certificateOfServiceDate,
    applicationContext
      .getUtilities()
      .validateDateAndCreateISO({ day, month, year }),
  );

  const secondaryDocument = get(state.form.secondaryDocument);

  if (secondaryDocument) {
    month = get(state.form.secondaryDocument.certificateOfServiceMonth);
    day = get(state.form.secondaryDocument.certificateOfServiceDay);
    year = get(state.form.secondaryDocument.certificateOfServiceYear);
    store.set(
      state.form.secondaryDocument.certificateOfServiceDate,
      applicationContext
        .getUtilities()
        .validateDateAndCreateISO({ day, month, year }),
    );
  }

  const supportingDocuments = get(state.form.supportingDocuments);

  if (supportingDocuments) {
    supportingDocuments.forEach((item, idx) => {
      month = get(
        state.form.supportingDocuments[idx].certificateOfServiceMonth,
      );
      day = get(state.form.supportingDocuments[idx].certificateOfServiceDay);
      year = get(state.form.supportingDocuments[idx].certificateOfServiceYear);
      store.set(
        state.form.supportingDocuments[idx].certificateOfServiceDate,
        applicationContext
          .getUtilities()
          .validateDateAndCreateISO({ day, month, year }),
      );
    });
  }

  const secondarySupportingDocuments = get(
    state.form.secondarySupportingDocuments,
  );

  if (secondarySupportingDocuments) {
    secondarySupportingDocuments.forEach((item, idx) => {
      month = get(
        state.form.secondarySupportingDocuments[idx].certificateOfServiceMonth,
      );
      day = get(
        state.form.secondarySupportingDocuments[idx].certificateOfServiceDay,
      );
      year = get(
        state.form.secondarySupportingDocuments[idx].certificateOfServiceYear,
      );
      store.set(
        state.form.secondarySupportingDocuments[idx].certificateOfServiceDate,
        applicationContext
          .getUtilities()
          .validateDateAndCreateISO({ day, month, year }),
      );
    });
  }
};
