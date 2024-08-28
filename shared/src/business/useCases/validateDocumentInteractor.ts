import { DocketEntry } from '../entities/DocketEntry';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

/**
 * validateDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.document the document to be validated
 * @returns {object} the validation errors or null
 */
export const validateDocumentInteractor = (
  { document }: { document: any },
  authorizedUser: UnknownAuthUser,
) => {
  const errors = new DocketEntry(document, {
    authorizedUser,
  }).getFormattedValidationErrors();

  return errors || null;
};
