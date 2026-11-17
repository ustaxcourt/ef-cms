import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { checkEmailIsPractitionerInteractor } from '@web-client/proxies/users/checkEmailIsPractitionerProxy';

const MATCHING_PETITIONER_ERROR =
  'This email is already associated with another petitioner on this case. Please use a different email address.';
const MATCHING_PRACTITIONER_ERROR =
  'Email address is associated with a practitioner account.';

const checkEmails = (
  confirmEmail: string,
  allPendingEmails: string[],
  caseDetail: RawCase,
): { confirmEmail?: string } => {
  const errors: { confirmEmail?: string } = {};
  if (!confirmEmail) return errors;

  const pendingMatchesConfirm = allPendingEmails
    .map(p => (p || '').toLowerCase())
    .includes((confirmEmail || '').toLowerCase());

  const currentMatchesConfirm = caseDetail.petitioners
    .map(p => (p.email || '').toLowerCase())
    .includes((confirmEmail || '').toLowerCase());

  if (pendingMatchesConfirm || currentMatchesConfirm) {
    errors.confirmEmail = MATCHING_PETITIONER_ERROR;
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
export const validatePetitionerAction = async ({
  applicationContext,
  get,
  store,
  path,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);

  const { contact } = get(state.form);

  const { allPendingEmails = [] } = get(state.screenMetadata) || {};

  const { confirmEmail } = contact;

  const errors: Record<string, string> = {};

  if (confirmEmail) {
    Object.assign(
      errors,
      checkEmails(confirmEmail, allPendingEmails, caseDetail),
    );

    const {
      lastEmailCheck,
    }: { lastEmailCheck?: { email: string; value: boolean } } = get(state.form);

    if (!lastEmailCheck || lastEmailCheck.email !== confirmEmail) {
      const isPractitionerEmail = await checkEmailIsPractitionerInteractor(
        applicationContext,
        {
          email: confirmEmail,
        },
      );

      store.set(state.form.lastEmailCheck, {
        email: confirmEmail,
        value: isPractitionerEmail,
      });

      if (isPractitionerEmail) {
        errors.confirmEmail = MATCHING_PRACTITIONER_ERROR;
      }
    } else if (lastEmailCheck?.value)
      errors.confirmEmail = MATCHING_PRACTITIONER_ERROR;
  }

  const result = applicationContext.getUseCases().validatePetitionerInteractor({
    contactInfo: contact,
    existingPetitioners: caseDetail.petitioners,
  });

  if (result) Object.assign(errors, result);

  return isEmpty(errors)
    ? path.success()
    : path.error({ errors: { contact: errors } });
};
