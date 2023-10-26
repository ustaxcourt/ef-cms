import {
  Case,
  getPetitionerById,
  updatePetitioner,
} from '@shared/business/entities/cases/Case';
import { Petitioner } from '../entities/contacts/Petitioner';
import { RawContact } from '../entities/contacts/Contact';
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
  applicationContext: IApplicationContext,
  { caseDetail, contactInfo }: { contactInfo: RawContact; caseDetail: RawCase },
) => {
  const contactErrors = new Petitioner(contactInfo, {
    applicationContext,
  }).getFormattedValidationErrors();

  let updateUserEmailErrors;
  if (contactInfo.updatedEmail || contactInfo.confirmEmail) {
    updateUserEmailErrors = new UpdateUserEmail({
      ...contactInfo,
      email: contactInfo.updatedEmail,
    }).getFormattedValidationErrors();
  }

  let caseErrors;

  const petitionerToUpdate = getPetitionerById(
    caseDetail,
    contactInfo.contactId,
  );
  const updatedPetitioner = { ...petitionerToUpdate, ...contactInfo };
  updatePetitioner(caseDetail, updatedPetitioner);
  const petitionerIndex = caseDetail.petitioners.findIndex(
    p => p.contactId === updatedPetitioner.contactId,
  );
  caseErrors = new Case(caseDetail, {
    applicationContext,
  }).getFormattedValidationErrors();

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
    ...contactErrors,
    ...updateUserEmailErrors,
    ...addPetitionerErrors,
  };

  return !isEmpty(aggregatedErrors) ? aggregatedErrors : undefined;
};
