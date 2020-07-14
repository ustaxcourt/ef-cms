const { CASE_TYPES_MAP } = require('../entities/EntityConstants');

/**
 * a function used for getting the suffix associated with a caseType and procedureType
 *
 * @param {object} providers the providers object
 * @param {string} providers.caseType the case type of the case
 * @param {string} providers.procedureType the procedure type of the case
 * @returns {string} the docket number suffix
 */
exports.getDocketNumberSuffix = ({ caseType = '', procedureType = '' }) => {
  switch (caseType) {
    case CASE_TYPES_MAP.whistleblower:
      return 'W';
    case CASE_TYPES_MAP.passport:
      return 'P';
    case CASE_TYPES_MAP.djExemptOrg:
      return 'X';
    case CASE_TYPES_MAP.djRetirementPlan:
      return 'R';
    case CASE_TYPES_MAP.cdp:
      return procedureType.toLowerCase() === 'small' ? 'SL' : 'L';
    default:
      return procedureType.toLowerCase() === 'small' ? 'S' : null;
  }
};
