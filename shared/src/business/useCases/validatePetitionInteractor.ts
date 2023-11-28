import { IncompleteEditElectronicPetition } from '../entities/cases/IncompleteEditElectronicPetition';

export const validatePetitionInteractor = (
  applicationContext: IApplicationContext,
  { petition }: { petition: any },
) => {
  return new IncompleteEditElectronicPetition(petition, {
    applicationContext,
  }).getFormattedValidationErrors();
};
