const {
  CaseAssociationRequestFactory,
} = require('../../entities/CaseAssociationRequestFactory');

/**
 * validateCaseAssociationRequestInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.caseAssociationRequest the case association request data
 * @returns {object} errors if there are any, or null
 */
exports.validateCaseAssociationRequestInteractor = (
  applicationContext,
  { caseAssociationRequest },
) => {
  const errors = CaseAssociationRequestFactory(
    caseAssociationRequest,
  ).getFormattedValidationErrors();

  return errors || null;
};
