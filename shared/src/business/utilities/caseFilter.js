const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { cloneDeep, pick } = require('lodash');
const { isAssociatedUser, isSealedCase } = require('../entities/cases/Case');
const CASE_ATTRIBUTE_WHITELIST = [
  'docketNumber',
  'docketNumberSuffix',
  'isPaper',
  'isSealed',
  'sealedDate',
];

const CASE_CONTACT_ATTRIBUTE_WHITELIST = [
  'additionalName',
  'contactId',
  'contactType',
  'inCareOf',
  'isAddressSealed',
  'name',
  'secondaryName',
  'serviceIndicator',
  'title',
];

const caseSealedFormatter = caseRaw => {
  return pick(caseRaw, CASE_ATTRIBUTE_WHITELIST);
};

/**
 * caseContactAddressSealedFormatter
 * Modifies raw case data if a contact address is sealed
 * and user does not have permission to view sealed addresses.
 * When sealed addresses are being formatted, the contact objects are
 * emptied of all entries, then assigned key/value pairs from a whitelist.
 *
 * @param {object} caseRaw the raw case detail
 * @param {object} currentUser the current
 * @returns {object} reference to modified raw case detail
 */
const caseContactAddressSealedFormatter = (caseRaw, currentUser) => {
  const userCanViewSealedAddresses = isAuthorized(
    currentUser,
    ROLE_PERMISSIONS.VIEW_SEALED_ADDRESS,
  );

  if (userCanViewSealedAddresses) {
    return caseRaw;
  }
  const formattedCase = cloneDeep(caseRaw);

  const formatSealedAddress = contactRaw => {
    const result = pick(contactRaw, CASE_CONTACT_ATTRIBUTE_WHITELIST);
    result.sealedAndUnavailable = true;
    return result;
  };

  const caseContactsToBeSealed = (formattedCase.petitioners || []).filter(
    caseContact => caseContact && caseContact.isAddressSealed,
  );

  caseContactsToBeSealed.forEach(caseContact => {
    const sealedContactAddress = formatSealedAddress(caseContact);
    Object.keys(caseContact).forEach(key => delete caseContact[key]);
    Object.assign(caseContact, sealedContactAddress);
  });

  return formattedCase;
};

const caseSearchFilter = (cases, currentUser) => {
  const caseSearchFilterConditionals = caseRaw =>
    !isSealedCase(caseRaw) ||
    isAssociatedUser({ caseRaw, user: currentUser }) ||
    isAuthorized(currentUser, ROLE_PERMISSIONS.VIEW_SEALED_CASE);

  return cases
    .filter(caseSearchFilterConditionals)
    .map(filteredCase =>
      caseContactAddressSealedFormatter(filteredCase, currentUser),
    );
};

module.exports = {
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
  caseSearchFilter,
};
