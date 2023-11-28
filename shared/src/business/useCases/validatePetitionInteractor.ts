import { CaseExternal } from '../entities/cases/IncompleteEditElectronicPetition';

export const validatePetitionInteractor = (
  applicationContext: IApplicationContext,
  { petition }: { petition: any },
) => {
  return new CaseExternal(petition, {
    applicationContext,
  }).getFormattedValidationErrors();
};
