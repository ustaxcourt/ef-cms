import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { cloneDeep, pick } from 'lodash';
import { isAssociatedUser, isSealedCase } from '../entities/cases/Case';

const CASE_ATTRIBUTE_WHITELIST = [
  'docketNumber',
  'docketNumberSuffix',
  'isPaper',
  'isSealed',
  'sealedDate',
] as const;

type CaseAttributeWhitelistKeys = (typeof CASE_ATTRIBUTE_WHITELIST)[number];

const CASE_CONTACT_ATTRIBUTE_WHITELIST = [
  'additionalName',
  'contactId',
  'contactType',
  'inCareOf',
  'isAddressSealed',
  'name',
  'sealedTo',
  'secondaryName',
  'serviceIndicator',
  'title',
];

export type SealedCase = Record<CaseAttributeWhitelistKeys, any>;

export const caseSealedFormatter = caseRaw => {
  return pick(caseRaw, CASE_ATTRIBUTE_WHITELIST) as SealedCase;
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
export const caseContactAddressSealedFormatter = (caseRaw, currentUser) => {
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

export const caseSearchFilter = (searchResults, currentUser) => {
  return searchResults
    .filter(
      searchResult =>
        !(
          isSealedCase(searchResult) ||
          searchResult.isCaseSealed ||
          searchResult.isDocketEntrySealed
        ) ||
        isAssociatedUser({ caseRaw: searchResult, user: currentUser }) ||
        isAuthorized(currentUser, ROLE_PERMISSIONS.VIEW_SEALED_CASE),
    )
    .map(filteredCase =>
      caseContactAddressSealedFormatter(filteredCase, currentUser),
    );
};
