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
  getPetitionerById,
  isAssociatedUser,
  isUserPartOfGroup,
} from '../entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { PublicCase } from '../entities/cases/PublicCase';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { User } from '../entities/User';
import {
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
} from '../utilities/caseFilter';

const getSealedCase = ({
  authorizedUser,
  caseRecord,
  isAssociatedWithCase,
}: {
  caseRecord: RawCase;
  isAssociatedWithCase: boolean;
  authorizedUser: AuthUser;
}): RawCase | RawPublicCase => {
  let isAuthorizedToViewSealedCase = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.VIEW_SEALED_CASE,
  );

  if (!isAuthorizedToViewSealedCase) {
    const petitioner = getPetitionerById(caseRecord, authorizedUser.userId);
    if (petitioner) {
      isAuthorizedToViewSealedCase = isAuthorized(
        authorizedUser,
        ROLE_PERMISSIONS.VIEW_SEALED_CASE,
        getPetitionerById(caseRecord, authorizedUser.userId).contactId,
      );
    }
  }

  if (isAuthorizedToViewSealedCase || isAssociatedWithCase) {
    return new Case(caseRecord, { authorizedUser }).validate().toRawObject();
  } else {
    caseRecord = caseSealedFormatter(caseRecord);

    return new PublicCase(caseRecord, {
      authorizedUser,
    })
      .validate()
      .toRawObject();
  }
};

const getCaseForExternalUser = ({
  authorizedUser,
  caseRecord,
  isAssociatedWithCase,
  isAuthorizedToGetCase,
}) => {
  if (isAuthorizedToGetCase && isAssociatedWithCase) {
    return new Case(caseRecord, { authorizedUser }).validate().toRawObject();
  } else {
    return new PublicCase(caseRecord, {
      authorizedUser,
    })
      .validate()
      .toRawObject();
  }
};

/**
 * Decorate a case with some calculations based on the attributes of the case that may be
 * obfuscated to the client
 * @param {Object} caseRecord the original caseRecord
 * @returns {Object} decorated caseRecord
 */
export const decorateForCaseStatus = (caseRecord: RawCase) => {
  // allow document service
  caseRecord.canAllowDocumentService =
    canAllowDocumentServiceForCase(caseRecord);

  caseRecord.canAllowPrintableDocketRecord =
    canAllowPrintableDocketRecord(caseRecord);

  caseRecord.canDojPractitionersRepresentParty =
    canDojPractitionersRepresentPartyForCase(caseRecord);

  return caseRecord;
};

/**
 * getCaseInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get
 * @returns {object} the case data
 */
export const getCaseInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view docket Number: ${docketNumber}`,
    );
  }

  const caseRecord = decorateForCaseStatus(
    await applicationContext.getPersistenceGateway().getCaseByDocketNumber({
      applicationContext,
      docketNumber: Case.formatDocketNumber(docketNumber),
    }),
  );
  const isValidCase = Boolean(caseRecord.docketNumber && caseRecord.entityName);

  if (!isValidCase) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  // Authorized to get case:
  // • either you do not lack permissions to get a case (unnecessary check!)
  // • or you are the petitioner on the case
  // • or you are directly associated with some member case
  let isAuthorizedToGetCase = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.GET_CASE,
  );
  if (!isAuthorizedToGetCase) {
    const petitioner = getPetitionerById(caseRecord, authorizedUser.userId);
    if (petitioner) {
      isAuthorizedToGetCase = isAuthorized(
        authorizedUser,
        ROLE_PERMISSIONS.GET_CASE,
        getPetitionerById(caseRecord, authorizedUser.userId).contactId,
      );
    } else if (caseRecord.leadDocketNumber) {
      isAuthorizedToGetCase = isUserPartOfGroup({
        consolidatedCases: caseRecord.consolidatedCases,
        userId: authorizedUser.userId,
      });
    }
  }

  // Associated with case if:
  // • You are a practitioner on the case
  // • You are the petitioner on the case
  // • The petition is served, and you are an IRS Superuser
  let isAssociatedWithCase = isAssociatedUser({
    caseRaw: caseRecord,
    user: authorizedUser,
  });

  if (caseRecord.leadDocketNumber) {
    isAssociatedWithCase =
      isAssociatedWithCase ||
      isUserPartOfGroup({
        consolidatedCases: caseRecord.consolidatedCases,
        userId: authorizedUser.userId,
      });
  }

  let caseDetailRaw;
  const isSealedCase = applicationContext
    .getUtilities()
    .isSealedCase(caseRecord);

  caseRecord.isSealed = isSealedCase;

  // If this is a sealed case:
  // If you are authorized or associated with the case (or an IRS Superuser, with VIEW_SEALED_CASE), you get the full Case
  // Otherwise, you get a Public Case
  if (isSealedCase) {
    caseDetailRaw = await getSealedCase({
      authorizedUser,
      caseRecord,
      isAssociatedWithCase,
    });
  } else {
    const { role: userRole } = authorizedUser;
    const isInternalUser = User.isInternalUser(userRole);

    if (isInternalUser) {
      caseDetailRaw = new Case(caseRecord, { authorizedUser })
        .validate()
        .toRawObject();
    } else {
      // If you are authorized to get a case and associated, you get a full case
      // Otherwise, you get a public case
      caseDetailRaw = await getCaseForExternalUser({
        authorizedUser,
        caseRecord,
        isAssociatedWithCase,
        isAuthorizedToGetCase,
      });
    }
  }

  caseDetailRaw = caseContactAddressSealedFormatter(
    caseDetailRaw,
    authorizedUser,
  );
  return caseDetailRaw;
};
