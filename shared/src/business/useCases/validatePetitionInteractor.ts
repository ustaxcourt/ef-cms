import { ElectronicPetition } from '../entities/cases/ElectronicPetition';

export const validatePetitionInteractor = (
  _applicationContext: IApplicationContext,
  { petition }: { petition: any },
) => {
  return new ElectronicPetition(petition).getFormattedValidationErrors();
};
