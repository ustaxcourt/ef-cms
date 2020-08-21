const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { isAssociatedUser } = require('../entities/cases/Case');
const { pick } = require('lodash');
const CASE_ATTRIBUTE_WHITELIST = [
  'docketNumber',
  'docketNumberSuffix',
  'sealedDate',
];

const CASE_CONTACT_ATTRIBUTE_WHITELIST = [
  'contactId',
  'isAddressSealed',
  'name',
  'secondaryName',
  'title',
];

const caseSealedFormatter = caseRaw => {
  return pick(caseRaw, CASE_ATTRIBUTE_WHITELIST);
};

const caseContactAddressSealedFormatter = contactRaw => {
  return pick(contactRaw, CASE_CONTACT_ATTRIBUTE_WHITELIST);
};

const caseSearchFilter = (cases, currentUser) => {
  const caseSearchFilterConditionals = caseRaw =>
    !caseRaw.sealedDate ||
    isAssociatedUser({ caseRaw, user: currentUser }) ||
    isAuthorized(
      currentUser,
      ROLE_PERMISSIONS.VIEW_SEALED_CASE,
      caseRaw.userId,
    );
  return cases.filter(caseSearchFilterConditionals);
};

module.exports = {
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
  caseSearchFilter,
};
