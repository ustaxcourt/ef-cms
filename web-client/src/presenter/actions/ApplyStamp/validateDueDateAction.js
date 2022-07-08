import { state } from 'cerebral';

/**
 * validate the due date fields on the Apply Stamp form
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const validateDueDateAction = ({ applicationContext, get, path }) => {
  const form = get(state.form);

  const isValidDate = applicationContext
    .getUtilities()
    .isValidDateString(form.date);

  console.log(isValidDate, '****');

  if (isValidDate) {
    return path.success();
  } else {
    return path.error();
  }
};
