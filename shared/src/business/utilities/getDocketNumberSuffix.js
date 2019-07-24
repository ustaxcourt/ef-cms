/**
 * a function used for getting the suffix associated with a caseType and procedureType
 *
 * @param caseType the type of the case
 * @param procedureType the procedureType (small or regular)
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
    case 'CDP (Lien/Levy)':
      return procedureType.toLowerCase() === 'small' ? 'SL' : 'L';
    default:
      return procedureType.toLowerCase() === 'small' ? 'S' : null;
  }
};
