import { IncompleteEditElectronicPetitionInformationFactory } from '../../entities/cases/IncompleteEditElectronicPetitionInformationFactory';

/**
 * validateStartCaseWizardInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.petition the petition data
 * @returns {object} errors (null if no errors)
 */
export const validateStartCaseWizardInteractor = (
  applicationContext: IApplicationContext,
  { petition }: { petition: any },
) => {
  const errors = new IncompleteEditElectronicPetitionInformationFactory(
    petition,
    {
      applicationContext,
    },
  ).getFormattedValidationErrors();
  return errors || null;
};
