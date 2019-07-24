import { state } from 'cerebral';

/**
 * computes the certificate of service dates from the form
 * month, day and year values
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 */
export const computeCertificateOfServiceFormDateAction = ({ get, store }) => {
  let formDate = null;
  const formMonth = get(state.form.certificateOfServiceMonth);
  const formDay = get(state.form.certificateOfServiceDay);
  const formYear = get(state.form.certificateOfServiceYear);

  if (formMonth || formDay || formYear) {
    formDate = `${formYear}-${formMonth}-${formDay}`;

    formDate = formDate
      .split('-')
      .map(segment => (segment = segment.padStart(2, '0')))
      .join('-');
  }

  store.set(state.form.certificateOfServiceDate, formDate);

  const secondaryDocument = get(state.form.secondaryDocument);

  if (secondaryDocument) {
    let formDate = null;
    const formMonth = get(
      state.form.secondaryDocument.certificateOfServiceMonth,
    );
    const formDay = get(state.form.secondaryDocument.certificateOfServiceDay);
    const formYear = get(state.form.secondaryDocument.certificateOfServiceYear);

    if (formMonth || formDay || formYear) {
      formDate = `${formYear}-${formMonth}-${formDay}`;

      formDate = formDate
        .split('-')
        .map(segment => (segment = segment.padStart(2, '0')))
        .join('-');
    }

    store.set(state.form.secondaryDocument.certificateOfServiceDate, formDate);
  }
};
