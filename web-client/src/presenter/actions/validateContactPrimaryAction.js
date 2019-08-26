import { state } from 'cerebral';

/**
 * Validates primary contact information and redirects user to success or error path
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {Function} providers.get the cerebral get helper function
 * @param {Function} providers.path the cerebral path helper function
 * @returns {object} path.success or path.error
 */
export const validateContactPrimaryAction = ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const contactInfo = get(state.caseDetail.contactPrimary);
  const partyType = get(state.caseDetail.partyType);

  const errors = applicationContext
    .getUseCases()
    .validatePrimaryContactInteractor({
      contactInfo,
      partyType,
    });

  store.set(state.validationErrors.contactPrimary, errors || {});

  if (!errors) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
