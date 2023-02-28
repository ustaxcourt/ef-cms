import { state } from 'cerebral';

/**
 * returns the barNumber from state.advancedSearchForm.practitionerSearchByBarNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @returns {object} object containing barNumber from state.form
 */
export const getFormValueBarNumberAction = ({ get }) => {
  const barNumber = get(
    state.advancedSearchForm.practitionerSearchByBarNumber.barNumber,
  );

  return { barNumber };
};
