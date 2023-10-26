import { Case, updatePetitioner } from '@shared/business/entities/cases/Case';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { RawPetitioner } from '../entities/contacts/Petitioner';
import { UpdateUserEmail } from '../entities/UpdateUserEmail';
import { isEmpty, pick } from 'lodash';

/**
 * validatePetitionerInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contactInfo the contactInfo to validate
 * @returns {object} errors (null if no errors)
 */

export const validatePetitionerInteractor = (
  applicationContext: ClientApplicationContext,
  {
    caseDetail,
    contactInfo,
  }: {
    contactInfo: RawPetitioner & {
      updatedEmail?: string;
      confirmEmail?: string;
    };
    caseDetail: RawCase;
  },
) => {
  let updateUserEmailErrors;
  if (contactInfo.updatedEmail || contactInfo.confirmEmail) {
    updateUserEmailErrors = new UpdateUserEmail({
      ...contactInfo,
      email: contactInfo.updatedEmail,
    }).getFormattedValidationErrors();
  }

  updatePetitioner(caseDetail, contactInfo);

  const caseErrors = new Case(caseDetail, {
    applicationContext,
  }).getFormattedValidationErrors();

  const petitionerIndex = caseDetail.petitioners.findIndex(
    p => p.contactId === contactInfo.contactId,
  );

  let addPetitionerErrors = pick(caseErrors, [
    'petitioners',
    `petitioners[${petitionerIndex}]`,
  ]);

  if (addPetitionerErrors.petitioners) {
    const petitionerContactErrors = addPetitionerErrors.petitioners.find(
      item => item.index === petitionerIndex,
    );

    delete addPetitionerErrors.petitioners;
    delete petitionerContactErrors.index;

    addPetitionerErrors = {
      ...addPetitionerErrors,
      ...petitionerContactErrors,
    };
  }

  const aggregatedErrors = {
    ...updateUserEmailErrors,
    ...addPetitionerErrors,
  };

  return !isEmpty(aggregatedErrors) ? aggregatedErrors : undefined;
};
