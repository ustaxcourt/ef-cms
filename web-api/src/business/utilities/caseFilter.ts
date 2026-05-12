import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { cloneDeep, pick } from 'lodash';
import {
  isAssociatedUser,
  isSealedCase,
} from '@shared/business/entities/cases/Case';

/** OpenSearch rows may omit full {@link RawCase} shaping; callers coerce as needed. */
export type CaseAccessibilitySearchRow = RawCase & {
  isCaseSealed?: boolean;
  isDocketEntrySealed?: boolean;
  docketEntryId?: string;
};

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

export const formatSealedAddresses = (
  caseRaw: RawCase,
  currentUser: UnknownAuthUser,
): RawCase => {
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

  // Seal emails in docket entries
  const emailsToBeSealed = caseContactsToBeSealed.map(caseContact => {
    if (caseContact.email) {
      return caseContact.email;
    }
  });
  formattedCase.docketEntries?.forEach(docketEntry => {
    docketEntry.servedParties?.forEach(party => {
      if (emailsToBeSealed.includes(party.email)) {
        party.email = undefined;
      }
    });
  });

  caseContactsToBeSealed.forEach(caseContact => {
    const sealedContactAddress = formatSealedAddress(caseContact);
    Object.keys(caseContact).forEach(key => delete caseContact[key]);
    Object.assign(caseContact, sealedContactAddress);
  });

  return formattedCase;
};

export const filterCaseSearchResultsNotAccessibleToUser = (
  searchResults: CaseAccessibilitySearchRow[],
  currentUser: UnknownAuthUser,
): RawCase[] => {
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
    .map(c => formatSealedAddresses(c as RawCase, currentUser));
};
