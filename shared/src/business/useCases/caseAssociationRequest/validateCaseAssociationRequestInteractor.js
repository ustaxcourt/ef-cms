const {
  CaseAssociationRequestFactory,
} = require('../../entities/CaseAssociationRequestFactory');

/**
 * validateCaseAssociationRequestInteractor
 *
 * @param {object} providers the providers object
 * @param {string} providers.caseAssociationRequest the case association request data
 * @returns {object} errors if there are any, or null
 */
exports.validateCaseAssociationRequestInteractor = ({
  caseAssociationRequest,
}) => {
  const errors = CaseAssociationRequestFactory(
    caseAssociationRequest,
  ).getFormattedValidationErrors();

  return errors || null;
};
