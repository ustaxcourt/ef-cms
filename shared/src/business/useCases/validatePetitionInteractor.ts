import { ElectronicPetition } from '../entities/cases/ElectronicPetition';

export const validatePetitionInteractor = (
  applicationContext: IApplicationContext,
  { petition }: { petition: any },
) => {
  return new ElectronicPetition(petition, {
    applicationContext,
  }).getFormattedValidationErrors();
};
