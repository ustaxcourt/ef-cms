import { state } from 'cerebral';

/**
 * Validates secondary contact information and redirects user to success or error path
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {Function} providers.path the cerebral path helper function
 * @param {object} providers.store the cerebral store object
 * @returns {object} path.success or path.error
 */
export const validateSecondaryContactAction = ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const contactInfo = get(state.caseDetail.contactSecondary);
  const partyType = get(state.caseDetail.partyType);

  const errors = applicationContext
    .getUseCases()
    .validateSecondaryContactInteractor({
      contactInfo,
      partyType,
    });

  store.set(state.validationErrors.contactSecondary, errors || {});

  if (!errors) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
