const {
  CaseAssociationRequestFactory,
} = require('../../entities/CaseAssociationRequestFactory');

/**
 * validateCaseAssociationRequestInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseAssociationRequest the case association request data
 * @returns {object} errors if there are any, or null
 */
exports.validateCaseAssociationRequestInteractor = ({
  applicationContext,
  caseAssociationRequest,
}) => {
  const errors = CaseAssociationRequestFactory(caseAssociationRequest, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};
