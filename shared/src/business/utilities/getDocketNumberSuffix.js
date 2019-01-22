/**
 * a function used for getting the suffix associated with a caseType and procedureType
 *
 * @param caseType the type of the case
 * @param procedureType the procedureType (small or regular)
 */
exports.getDocketNumberSuffix = ({ caseType = '', procedureType = '' }) => {
  switch (caseType.toLowerCase()) {
    case 'whistleblower':
      return 'W';
    case 'passport':
      return 'P';
    case 'exempt organization':
      return 'X';
    case 'retirement plan':
      return 'R';
    case 'cdp (lien/levy)':
      return procedureType.toLowerCase() === 'small' ? 'SL' : 'L';
    default:
      return procedureType.toLowerCase() === 'small' ? 'S' : null;
  }
};
