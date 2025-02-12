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
import { formatSealedAddresses } from '@shared/business/utilities/caseFilter';

function assertInstanceOf<T>(
  instance: any,
  constructor: { new (...args: any[]): T },
  errorMessage: string,
): asserts instance is T {
  if (!(instance instanceof constructor)) {
    throw new Error(errorMessage);
  }
}

export class CaseFactory {
  private static getCaseOfType<T>({
    constructor,
    rawCase,
    user,
  }: {
    constructor: { new (...args: any[]): T };
    rawCase: any;
    user: UnknownAuthUser;
  }) {
    const theCase = constructCaseForUser({ rawCase, user });
    assertInstanceOf(
      theCase,
      constructor,
      `Requested ${constructor.name} from CaseFactory, but user does not have access`,
    );
    return theCase as T;
  }

  // If you are sure you should be working with the full case details, call this
  static getFullCase({
    rawCase,
    user,
  }: {
    rawCase: any;
    user: UnknownAuthUser;
  }) {
    return this.getCaseOfType<Case>({ constructor: Case, rawCase, user });
  }

  static getCase({ rawCase, user }: { rawCase: any; user: UnknownAuthUser }) {
    return constructCaseForUser({ rawCase, user });
  }
}

// A centralized function to format and construct a case given a user and rawCase data.
function constructCaseForUser({
  rawCase,
  user,
}: {
  rawCase: any;
  user: UnknownAuthUser;
}): Case | PublicCase | RestrictedCase {
  const userIsLoggedIn = isAuthUser(user);
  const caseIsSealed = isSealedCase(rawCase);
  rawCase.isSealed = caseIsSealed;

  rawCase = formatSealedAddresses(rawCase, user);
  rawCase = decorateForCaseStatus(rawCase);

  // If user has access to all case data, return the full case data
  if (
    userIsLoggedIn &&
    isAuthorized(user, ROLE_PERMISSIONS.GET_ALL_CASE_DATA)
  ) {
    return new Case(rawCase, { authorizedUser: user });
  }

  // Users who do not have access to all case data should not see docket entries that are not on the record, like drafts,
  // EXCEPT the IRS superuser, who can see only the non-docket STIN document
  if (rawCase.docketEntries) {
    filterDocketEntriesNotOnDocketRecord({ authorizedUser: user, rawCase });
  }

  // If the user is not logged in, return whatever subset of data is allowed to the public
  if (!userIsLoggedIn) {
    return caseIsSealed
      ? new RestrictedCase(rawCase)
      : new PublicCase(rawCase, { authorizedUser: user });
  }

  const userIsAssociated = userIsAssociatedWithCase({
    authorizedUser: user as AuthUser,
    rawCase,
  });

  // Petitioners and practitioners on a case have full read access to the case
  if (userIsAssociated) {
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

  // User is logged in but neither has permissions to view all cases nor is associated with the case,
  // so they see whatever subset of data is allowed to the public
  return caseIsSealed
    ? new RestrictedCase(rawCase)
    : new PublicCase(rawCase, { authorizedUser: user });
}

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
  authorizedUser: UnknownAuthUser;
}) => {
  rawCase.docketEntries = rawCase.docketEntries.filter(
    d =>
      d.isOnDocketRecord ||
      (authorizedUser &&
        d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType &&
        authorizedUser.role === ROLES.irsSuperuser),
  );
};
