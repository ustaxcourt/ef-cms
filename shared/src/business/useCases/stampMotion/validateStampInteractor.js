const { Stamp } = require('../../entities/Stamp');

/**
 * validateStampInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.stampMotionForm the stamp motion form
 * @returns {object} errors if there are any, otherwise null
 */
exports.validateStampInteractor = (applicationContext, { stampMotionForm }) => {
  const errors = new Stamp(stampMotionForm, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};
