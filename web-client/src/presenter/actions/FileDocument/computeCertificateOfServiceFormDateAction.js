import { state } from 'cerebral';

/**
 * computes the date from a month, day and year value
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object
 * @param {Object} providers.get the cerebral get function
 */
export const computeCertificateOfServiceFormDateAction = ({ store, get }) => {
  let formDate = `${get(state.form.certificateOfServiceYear)}-${get(
    state.form.certificateOfServiceMonth,
  )}-${get(state.form.certificateOfServiceDay)}`;

  formDate = formDate
    .split('-')
    .map(segment => (segment = segment.padStart(2, '0')))
    .join('-');

  store.set(state.form.certificateOfServiceDate, formDate);
};
