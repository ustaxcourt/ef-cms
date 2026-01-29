import { Stamp } from '../../entities/Stamp';

/**
 * validateStampInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.stampMotionForm the stamp motion form
 * @returns {object} errors if there are any, otherwise null
 */
export const validateStampInteractor = ({ stampMotionForm }) => {
  const errors = new Stamp(stampMotionForm).getFormattedValidationErrors();

  return errors || null;
};
