import { PractitionerDocument } from '../../entities/PractitionerDocument';

/**
 * validateAddPractitionerDocumentFormInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.stampMotionForm the stamp motion form
 * @returns {object} errors if there are any, otherwise null
 */
export const validateAddPractitionerDocumentFormInteractor = (
  applicationContext,
  form,
) => {
  const errors = new PractitionerDocument(
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

  return errors || null;
};
