/**
 * resets the state serviceDate Day, Month, and Year values which are used to render the date in the serviceDate datePicker
 *
 * @param {object} providers the providers object
 */
export const clearServiceDateAction = () => {
  const input = window.document.getElementById('date-of-service-date');
  if (input && input.value) {
    input.value = null;
  }
};
