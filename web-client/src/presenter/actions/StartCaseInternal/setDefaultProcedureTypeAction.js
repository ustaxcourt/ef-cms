import { state } from 'cerebral';

/**
 * sets currentViewMetadata.startCaseInternal tab to props tab
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props the cerebral props object
 * @param {Function} providers.store the cerebral store object
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
