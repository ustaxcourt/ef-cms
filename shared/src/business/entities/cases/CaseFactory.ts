import {
  AuthUser,
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import {
  Case,
  canAllowDocumentServiceForCase,
  canAllowPrintableDocketRecord,
  canDojPractitionersRepresentPartyForCase,
  isSealedCase,
  isUserPartOfGroup,
  userIsDirectlyAssociated,
} from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  INITIAL_DOCUMENT_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RestrictedCase } from '@shared/business/entities/cases/RestrictedCase';
import { caseContactAddressSealedFormatter } from '@shared/business/utilities/caseFilter';

export function CaseFactory({
  rawCase,
  user,
}: {
  rawCase: any;
  user: UnknownAuthUser;
}): Case | PublicCase | RestrictedCase {
  // TODO: Return type of narrower Case which FullCase, PublicCase, and RestrictedCase extend? Or union type?
  const userIsLoggedIn = isAuthUser(user);
  const caseIsSealed = isSealedCase(rawCase);
  rawCase.isSealed = caseIsSealed;

  // TODO 10502: Should this be moved to the constructors? If so, probably on a root class that is extended.
  rawCase = caseContactAddressSealedFormatter(rawCase, user);
  rawCase = decorateForCaseStatus(rawCase);

  if (!userIsLoggedIn) {
    return caseIsSealed
      ? new RestrictedCase(rawCase)
      : new PublicCase(rawCase, { authorizedUser: user });
  }

  if (isAuthorized(user, ROLE_PERMISSIONS.GET_ALL_CASES)) {
    return new Case(rawCase, { authorizedUser: user });
  }

  // TODO 10502: Should this be on the Case constructor?
  // Users who cannot get all case data should not see entries that are not on the record, like drafts,
  // EXCEPT the IRS superuser, who can see only the non-docket STIN document
  filterDocketEntriesNotOnDocketRecord({ authorizedUser: user, rawCase });

  // Petitioners and practitioners on a case have full read access to the case
  if (
    userIsAssociatedWithCase({
      authorizedUser: user as AuthUser,
      rawCase,
    })
  ) {
    return new Case(rawCase, { authorizedUser: user });
  }

  // IRS super users have full read access to all cases with served petitions
  if (
    userIsIrsSuperuserAndCasePetitionIsServed({
      authorizedUser: user as AuthUser,
      rawCase,
    })
  ) {
    return new Case(rawCase, { authorizedUser: user });
  }

  // User is logged in but neither has permissions to view all cases nor is associated with the case
  if (
    !isAuthorized(user, ROLE_PERMISSIONS.GET_ALL_CASES) &&
    !userIsAssociatedWithCase
  ) {
    return caseIsSealed
      ? new RestrictedCase(rawCase)
      : new PublicCase(rawCase, { authorizedUser: user });
  }

  return new PublicCase(rawCase, { authorizedUser: user });
}

// TODO 10502: Move onto constructors?
export const decorateForCaseStatus = (caseRecord: RawCase) => {
  caseRecord.canAllowDocumentService =
    canAllowDocumentServiceForCase(caseRecord);

  caseRecord.canAllowPrintableDocketRecord =
    canAllowPrintableDocketRecord(caseRecord);

  caseRecord.canDojPractitionersRepresentParty =
    canDojPractitionersRepresentPartyForCase(caseRecord);

  return caseRecord;
};

const userIsAssociatedWithCase = ({
  authorizedUser,
  rawCase,
}: {
  rawCase: any;
  authorizedUser: AuthUser;
}) => {
  const userIsDirectlyAssociatedWithCase = userIsDirectlyAssociated({
    aCase: rawCase,
    userId: authorizedUser.userId,
  });
  const userIsIndirectlyAssociatedWithCase = isUserPartOfGroup({
    consolidatedCases: rawCase.consolidatedCases || [],
    userId: (authorizedUser as AuthUser).userId,
  });
  return userIsDirectlyAssociatedWithCase || userIsIndirectlyAssociatedWithCase;
};

const userIsIrsSuperuserAndCasePetitionIsServed = ({
  authorizedUser,
  rawCase,
}: {
  authorizedUser: AuthUser;
  rawCase: any;
}) => {
  const userIsIrsSuperUser = authorizedUser.role === ROLES.irsSuperuser;
  const petitionIsServed = casePetitionIsServed(rawCase);
  return userIsIrsSuperUser && petitionIsServed;
};

const casePetitionIsServed = (rawCase: any) => {
  const petitionDocketEntry = (rawCase.docketEntries || []).find(
    doc => doc.documentType === 'Petition',
  );

  return petitionDocketEntry && DocketEntry.isServed(petitionDocketEntry);
};

const filterDocketEntriesNotOnDocketRecord = ({
  authorizedUser,
  rawCase,
}: {
  rawCase: RawCase;
  authorizedUser: AuthUser;
}) => {
  rawCase.docketEntries = rawCase.docketEntries.filter(
    d =>
      d.isOnDocketRecord ||
      (d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType &&
        authorizedUser.role === ROLES.irsSuperuser),
  );
};
