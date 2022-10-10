import { Document } from '../../entities/Document';

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
  const errors = new Document(form, {
    applicationContext,
  }).getFormattedValidationErrors();

  return errors || null;
};
