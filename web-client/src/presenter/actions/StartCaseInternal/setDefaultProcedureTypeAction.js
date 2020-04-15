import { state } from 'cerebral';

/**
 * sets state.form.procedureType to a default if it is not already set on the form
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const setDefaultProcedureTypeAction = ({
  applicationContext,
  get,
  store,
}) => {
  const { procedureType } = get(state.form);
  const { PROCEDURE_TYPES } = applicationContext.getConstants();

  if (!procedureType) {
    store.set(state.form.procedureType, PROCEDURE_TYPES[0]);
  }
};
