import { state } from 'cerebral';

/**
 * computes the date from a month, day and year value
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 */
export const computeSecondaryFormDateAction = ({ get, store }) => {
  const secondaryDocument = get(state.form.secondaryDocument);

  if (secondaryDocument && secondaryDocument.documentType) {
    let formDate = `${get(state.form.secondaryDocument.year)}-${get(
      state.form.secondaryDocument.month,
    )}-${get(state.form.secondaryDocument.day)}`;

    formDate = formDate
      .split('-')
      .map(segment => (segment = segment.padStart(2, '0')))
      .join('-');

    store.set(state.form.secondaryDocument.serviceDate, formDate);
  }
};
