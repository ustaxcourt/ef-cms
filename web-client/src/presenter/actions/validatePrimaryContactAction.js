import { state } from 'cerebral';

/**
 * Validates primary contact information and redirects user to success or error path
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {Function} providers.path the cerebral path helper function
 * @param {object} providers.store the cerebral store object
 * @returns {object} path.success or path.error
 */
export const validatePrimaryContactAction = ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const { contactPrimary, partyType } = get(state.form);

  const errors = applicationContext
    .getUseCases()
    .validatePrimaryContactInteractor({
      applicationContext,
      contactInfo: contactPrimary,
      partyType,
    });

  store.set(state.validationErrors.contactPrimary, errors || {});

  if (!errors) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
