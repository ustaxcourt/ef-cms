const {
  CASE_TYPES_MAP,
  DOCKET_NUMBER_SUFFIXES,
} = require('../entities/EntityConstants');

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
      return DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER;
    case 'Passport':
      return DOCKET_NUMBER_SUFFIXES.PASSPORT;
    case 'Declaratory Judgment (Exempt Organization)':
      return DOCKET_NUMBER_SUFFIXES.DECLARATORY_JUDGEMENTS_FOR_EXEMPT_ORGS;
    case 'Declaratory Judgment (Retirement Plan)':
      return DOCKET_NUMBER_SUFFIXES.DECLARATORY_JUDGEMENTS_FOR_RETIREMENT_PLAN_REVOCATION;
    case CASE_TYPES_MAP.cdp:
      return procedureType.toLowerCase() === 'small'
        ? DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY
        : DOCKET_NUMBER_SUFFIXES.LIEN_LEVY;
    default:
      return procedureType.toLowerCase() === 'small'
        ? DOCKET_NUMBER_SUFFIXES.SMALL
        : null;
  }
};
