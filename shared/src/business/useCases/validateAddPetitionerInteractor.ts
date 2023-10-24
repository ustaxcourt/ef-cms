import { Case } from '../entities/cases/Case';
import { Petitioner } from '../entities/contacts/Petitioner';
import { isEmpty } from 'lodash';

/**
 * validateAddPetitionerInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contact the contact to validate
 * @returns {object} errors (null if no errors)
 */
export const validateAddPetitionerInteractor = (
  applicationContext: IApplicationContext,
  { caseDetail, contact }: { contact: any; caseDetail: RawCase },
) => {
  const petitionerErrors = new Petitioner(contact, {
    applicationContext,
  }).getFormattedValidationErrors();
  const caseTest = {
    ...caseDetail,
    petitioners: [...caseDetail.petitioners, contact],
  };
  console.log('caseTest', caseTest);
  const caseErrors = new Case(
    { ...caseTest, caseCaption: contact.caseCaption },
    {
      applicationContext,
    },
  ).getFormattedValidationErrors();

  const aggregatedErrors = {
    ...petitionerErrors,
    ...caseErrors,
  };

  return !isEmpty(aggregatedErrors) ? aggregatedErrors : undefined;
};
