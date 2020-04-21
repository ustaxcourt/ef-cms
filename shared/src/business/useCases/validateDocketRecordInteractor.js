const { DocketRecord } = require('../entities/DocketRecord');

/**
 * validateDocketRecordInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketRecord the docket record to be validated
 * @returns {object} the validation errors or null
 */
exports.validateDocketRecordInteractor = ({
  applicationContext,
  docketRecord,
}) => {
  const errors = new DocketRecord(docketRecord, {
    applicationContext,
  }).getFormattedValidationErrors();

  return errors || null;
};
