const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { isAssociatedUser } = require('../entities/cases/Case');
const CASE_ATTRIBUTE_WHITELIST = [
  'caseId',
  'docketNumber',
  'docketNumberSuffix',
  'sealedDate',
];

const caseSealedFormatter = caseRaw => {
  const sealedObj = {};
  CASE_ATTRIBUTE_WHITELIST.forEach(attr => {
    sealedObj[attr] = caseRaw[attr];
  });
  return sealedObj;
};

const caseSearchFilter = (cases, currentUser) => {
  const results = [];
  for (const caseRaw of cases) {
    if (
      !caseRaw.sealedDate ||
      isAssociatedUser({ caseRaw, user: currentUser }) ||
      isAuthorized(
        currentUser,
        ROLE_PERMISSIONS.VIEW_SEALED_CASE,
        caseRaw.userId,
      )
    ) {
      results.push(caseRaw);
    }
  }
  return results;
};

module.exports = {
  caseSealedFormatter,
  caseSearchFilter,
};
