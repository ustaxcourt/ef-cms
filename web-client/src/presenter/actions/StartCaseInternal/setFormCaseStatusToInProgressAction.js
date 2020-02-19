import { state } from 'cerebral';

/**
 * sets contactSecondary with contact prop
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store
 * @returns {void}
 */
export const setFormCaseStatusToInProgressAction = ({
  applicationContext,
  store,
}) => {
  const { Case } = applicationContext.getEntityConstructors();
  store.set(state.form.status, Case.STATUS_TYPES.inProgress);
};
