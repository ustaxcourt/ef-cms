const { Case } = require('../entities/cases/Case');

/**
 * checks case eligibility for consolidation by status
 *
 * @param {string} caseStatus case status
 * @returns {boolean} true if eligible, false otherwise
 */
exports.isCaseStatusEligible = caseStatus => {
  const ineligibleStatusTypes = [
    Case.STATUS_TYPES.batchedForIRS,
    Case.STATUS_TYPES.new,
    Case.STATUS_TYPES.recalled,
    Case.STATUS_TYPES.generalDocket,
    Case.STATUS_TYPES.closed,
    Case.STATUS_TYPES.onAppeal,
  ];

  return !ineligibleStatusTypes.includes(caseStatus);
};

/**
 * returns an array of statuses for a case's eligibility for consolidation.
 * if a case cannot be consolidated, the array will have messages; otherwise,
 * the result will be empty
 *
 * @param {object} leadCaseEntity the lead case entity
 * @param {object} pendingCaseEntity the pending case entity
 * @returns {object} canConsolidate flag indicating eligibility,
 * and the reason message (if cannot consolidate)
 */
exports.getCaseConsolidationStatus = ({
  leadCaseEntity,
  pendingCaseEntity,
}) => {
  const pendingCaseStatus = pendingCaseEntity.status;
  const leadCaseStatus = leadCaseEntity.status;

  if (leadCaseStatus !== pendingCaseStatus) {
    return { canConsolidate: false, reason: 'Case status is not the same.' };
  }

  if (leadCaseEntity.procedureType !== pendingCaseEntity.procedureType) {
    return { canConsolidate: false, reason: 'Case procedure is not the same.' };
  }

  if (
    leadCaseEntity.preferredTrialCity !== pendingCaseEntity.preferredTrialCity
  ) {
    return { canConsolidate: false, reason: 'Place of trial is not the same.' };
  }

  if (!exports.isCaseStatusEligible(pendingCaseStatus)) {
    return {
      canConsolidate: false,
      reason: `Case status is ${pendingCaseStatus} and cannot be consolidated.`,
    };
  }

  return { canConsolidate: true, reason: '' };
};
