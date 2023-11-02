import { DocketEntry } from '../entities/DocketEntry';

/**
 * validateDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.document the document to be validated
 * @returns {object} the validation errors or null
 */
export const validateDocumentInteractor = (
  applicationContext: IApplicationContext,
  { document }: { document: any },
) => {
  const errors = new DocketEntry(document, {
    applicationContext,
  }).getValidationErrors();

  return errors || null;
};
