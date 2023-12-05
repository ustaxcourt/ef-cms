import {
  Case,
  canAllowDocumentServiceForCase,
  canAllowPrintableDocketRecord,
  getPetitionerById,
  isAssociatedUser,
  isUserPartOfGroup,
} from '../entities/cases/Case';
import { NotFoundError } from '@web-api/errors/errors';
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
  applicationContext,
  caseRecord,
  isAssociatedWithCase,
}: {
  applicationContext: IApplicationContext;
  caseRecord: Case;
  isAssociatedWithCase: boolean;
}): Case => {
  const currentUser = applicationContext.getCurrentUser();

  let isAuthorizedToViewSealedCase = isAuthorized(
    currentUser,
    ROLE_PERMISSIONS.VIEW_SEALED_CASE,
  );

  if (!isAuthorizedToViewSealedCase) {
    const petitioner = getPetitionerById(caseRecord, currentUser.userId);
    if (petitioner) {
      isAuthorizedToViewSealedCase = isAuthorized(
        currentUser,
        ROLE_PERMISSIONS.VIEW_SEALED_CASE,
        getPetitionerById(caseRecord, currentUser.userId).contactId,
      );
    }
  }

  if (isAuthorizedToViewSealedCase || isAssociatedWithCase) {
    return new Case(caseRecord, { applicationContext })
      .validate()
      .toRawObject();
  } else {
    caseRecord = caseSealedFormatter(caseRecord);

    return new PublicCase(caseRecord, {
      applicationContext,
    })
      .validate()
      .toRawObject();
  }
};

const getCaseForExternalUser = ({
  applicationContext,
  caseRecord,
  isAssociatedWithCase,
  isAuthorizedToGetCase,
}) => {
  if (isAuthorizedToGetCase && isAssociatedWithCase) {
    return new Case(caseRecord, { applicationContext })
      .validate()
      .toRawObject();
  } else {
    return new PublicCase(caseRecord, {
      applicationContext,
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
) => {
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

  const currentUser = applicationContext.getCurrentUser();

  let isAuthorizedToGetCase = isAuthorized(
    currentUser,
    ROLE_PERMISSIONS.GET_CASE,
  );
  if (!isAuthorizedToGetCase) {
    const petitioner = getPetitionerById(caseRecord, currentUser.userId);
    if (petitioner) {
      isAuthorizedToGetCase = isAuthorized(
        currentUser,
        ROLE_PERMISSIONS.GET_CASE,
        getPetitionerById(caseRecord, currentUser.userId).contactId,
      );
    } else if (caseRecord.leadDocketNumber) {
      isAuthorizedToGetCase = isUserPartOfGroup({
        consolidatedCases: caseRecord.consolidatedCases,
        userId: currentUser.userId,
      });
    }
  }

  let isAssociatedWithCase = isAssociatedUser({
    caseRaw: caseRecord,
    user: currentUser,
  });

  if (caseRecord.leadDocketNumber) {
    isAssociatedWithCase =
      isAssociatedWithCase ||
      isUserPartOfGroup({
        consolidatedCases: caseRecord.consolidatedCases,
        userId: currentUser.userId,
      });
  }

  let caseDetailRaw;
  const isSealedCase = applicationContext
    .getUtilities()
    .isSealedCase(caseRecord);

  caseRecord.isSealed = isSealedCase;

  if (isSealedCase) {
    caseDetailRaw = await getSealedCase({
      applicationContext,
      caseRecord,
      isAssociatedWithCase,
    });
  } else {
    const { role: userRole } = currentUser;
    const isInternalUser = User.isInternalUser(userRole);

    if (isInternalUser) {
      caseDetailRaw = new Case(caseRecord, { applicationContext })
        .validate()
        .toRawObject();
    } else {
      caseDetailRaw = await getCaseForExternalUser({
        applicationContext,
        caseRecord,
        isAssociatedWithCase,
        isAuthorizedToGetCase,
      });
    }
  }

  caseDetailRaw = caseContactAddressSealedFormatter(caseDetailRaw, currentUser);
  return caseDetailRaw;
};
