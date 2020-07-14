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
    case 'Whistleblower':
      return 'W';
    case 'Passport':
      return 'P';
    case 'Declaratory Judgment (Exempt Organization)':
      return 'X';
    case 'Declaratory Judgment (Retirement Plan)':
      return 'R';
    case CASE_TYPES_MAP.cdp:
      return procedureType.toLowerCase() === 'small' ? 'SL' : 'L';
    default:
      return procedureType.toLowerCase() === 'small' ? 'S' : null;
  }
};
