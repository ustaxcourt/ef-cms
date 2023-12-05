import { CaseExternal } from '../entities/cases/CaseExternal';

export const validatePetitionInteractor = (
  applicationContext: IApplicationContext,
  { petition }: { petition: any },
) => {
  return new CaseExternal(petition, {
    applicationContext,
  }).getFormattedValidationErrors();
};
