import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { cloneDeep, pick } from 'lodash';
import { isAssociatedUser, isSealedCase } from '../entities/cases/Case';

const CASE_ATTRIBUTE_ALLOWLIST = [
  'docketNumber',
  'docketNumberSuffix',
  'isPaper',
  'isSealed',
  'sealedDate',
  'leadDocketNumber',
] as const;

type CaseAttributeAllowlistKeys = (typeof CASE_ATTRIBUTE_ALLOWLIST)[number];

const CASE_CONTACT_ATTRIBUTE_ALLOWLIST = [
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

export type SealedCase = Record<CaseAttributeAllowlistKeys, any>;

export const caseSealedFormatter = caseRaw => {
  return pick(caseRaw, CASE_ATTRIBUTE_ALLOWLIST) as SealedCase;
};

/**
 * caseContactAddressSealedFormatter
 * Modifies raw case data if a contact address is sealed
 * and user does not have permission to view sealed addresses.
 * When sealed addresses are being formatted, the contact objects are
 * emptied of all entries, then assigned key/value pairs from a allow list.
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
    const result = pick(contactRaw, CASE_CONTACT_ATTRIBUTE_ALLOWLIST);
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

export const caseSearchFilter = (searchResults, currentUser: AuthUser) => {
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
