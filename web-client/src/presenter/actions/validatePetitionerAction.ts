import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

const checkEmails = (
  confirmEmail: string,
  allPendingEmails: string[],
  petitioners: any[],
): { confirmEmail?: string } => {
  const errors: { confirmEmail?: string } = {};

  const pendingMatchesConfirm = allPendingEmails
    .map(p => (p || '').toLowerCase())
    .includes((confirmEmail || '').toLowerCase());

  const currentMatchesConfirm = petitioners
    .map(p => (p.email || '').toLowerCase())
    .includes((confirmEmail || '').toLowerCase());

  if (confirmEmail && (pendingMatchesConfirm || currentMatchesConfirm)) {
    errors.confirmEmail =
      'This email is already associated with another petitioner on this case. Please use a different email address.';
  }
  return errors;
};

/**
 * Validates petitioner information and redirects user to success or error path
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {Function} providers.path the cerebral path helper function
 * @param {object} providers.store the cerebral store object
 * @returns {object} path.success or path.error
 */
export const validatePetitionerAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);

  const { contact } = get(state.form);

  const { allPendingEmails = [] } = get(state.screenMetadata) || {};

  const { petitioners = [] } = caseDetail || {};

  const { confirmEmail } = contact;

  const errors = checkEmails(confirmEmail, allPendingEmails, petitioners);

  const result = applicationContext.getUseCases().validatePetitionerInteractor({
    contactInfo: contact,
    existingPetitioners: caseDetail.petitioners,
  });

  if (result) Object.assign(errors, result);

  return isEmpty(errors)
    ? path.success()
    : path.error({ errors: { contact: errors } });
};
