import { ElectronicPetition } from '../entities/cases/ElectronicPetition';

export const validatePetitionInteractor = ({ petition }: { petition: any }) => {
  return new ElectronicPetition(petition).getFormattedValidationErrors();
};
