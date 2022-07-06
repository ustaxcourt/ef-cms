import { state } from 'cerebral';

/**
 * validate the due date fields on the Apply Stamp form
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const validateDueDateAction = ({ get, store }) => {
  const form = get(state.form);

  console.log(JSON.stringify(form, null, 2));
};
