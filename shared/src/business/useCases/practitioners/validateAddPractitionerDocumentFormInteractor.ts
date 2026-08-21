import { ClientApplicationContext } from '@web-client/applicationContext';
import { PractitionerDocument } from '../../entities/PractitionerDocument';

export const validateAddPractitionerDocumentFormInteractor = (
  applicationContext: ClientApplicationContext,
  form,
) => {
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
