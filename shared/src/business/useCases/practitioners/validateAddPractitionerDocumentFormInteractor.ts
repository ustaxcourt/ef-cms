import { PractitionerDocument } from '../../entities/PractitionerDocument';
import { TValidationError } from '@shared/business/entities/joiValidationEntity/helper';

export const validateAddPractitionerDocumentFormInteractor = (
  applicationContext: IApplicationContext,
  form,
): TValidationError | null => {
  return new PractitionerDocument(
    {
      categoryName: form.categoryName,
      categoryType: form.categoryType,
      fileName: form.practitionerDocumentFile?.name || form.fileName,
      location: form.location,
    },
    {
      applicationContext,
    },
  ).getFormattedValidationErrors();
};
