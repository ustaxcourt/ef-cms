import { CaseExternal } from '../entities/cases/ElectronicPetition';

export const validatePetitionInteractor = (
  applicationContext: IApplicationContext,
  { petition }: { petition: any },
) => {
  return new CaseExternal(petition, {
    applicationContext,
  }).getFormattedValidationErrors();
};
