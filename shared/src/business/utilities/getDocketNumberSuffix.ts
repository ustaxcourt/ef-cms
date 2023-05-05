import {
  CASE_TYPES_MAP,
  DOCKET_NUMBER_SUFFIXES,
} from '../entities/EntityConstants';

/**
 * a function used for getting the suffix associated with a caseType and procedureType
 *
 * @param {object} providers the providers object
 * @param {string} providers.caseType the case type of the case
 * @param {string} providers.procedureType the procedure type of the case
 * @returns {string} the docket number suffix
 */
export const getDocketNumberSuffix = ({
  caseType = '',
  procedureType = '',
}) => {
  switch (caseType) {
    case CASE_TYPES_MAP.disclosure:
      return DOCKET_NUMBER_SUFFIXES.DISCLOSURE;
    case CASE_TYPES_MAP.whistleblower:
      return DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER;
    case CASE_TYPES_MAP.passport:
      return DOCKET_NUMBER_SUFFIXES.PASSPORT;
    case CASE_TYPES_MAP.djExemptOrg:
      return DOCKET_NUMBER_SUFFIXES.DECLARATORY_JUDGEMENTS_FOR_EXEMPT_ORGS;
    case CASE_TYPES_MAP.djRetirementPlan:
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
