import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { cloneDeep, pick } from 'lodash';
import { isAssociatedUser, isSealedCase } from '../entities/cases/Case';

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
  caseRaw: any,
  currentUser: UnknownAuthUser,
) => {
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

export const filterCaseSearchResultsNotAccessibleToUser = (
  searchResults,
  currentUser: UnknownAuthUser,
) => {
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
    .map(c => formatSealedAddresses(c, currentUser));
};
