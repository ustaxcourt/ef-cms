import {
  Case,
  canAllowDocumentServiceForCase,
  canAllowPrintableDocketRecord,
  getPetitionerById,
  isAssociatedUser,
  isSealedCase,
} from '../entities/cases/Case';
import { NotFoundError } from '../../errors/errors';
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
  caseRecord: TCase;
  isAssociatedWithCase: boolean;
}): TCase => {
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
 *
 * @param {Object} caseRecord the original caseRecord
 * @returns {Object} decorated caseRecord
 */
export const decorateForCaseStatus = (caseRecord: TCase) => {
  // allow document service
  caseRecord.canAllowDocumentService =
    canAllowDocumentServiceForCase(caseRecord);

  caseRecord.canAllowPrintableDocketRecord =
    canAllowPrintableDocketRecord(caseRecord);

  return caseRecord;
};

/**
 * getCaseInteractor
 *
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
    }
  }

  const isAssociatedWithCase = isAssociatedUser({
    caseRaw: caseRecord,
    user: currentUser,
  });

  let caseDetailRaw;
  caseRecord.isSealed = isSealedCase(caseRecord);
  if (isSealedCase(caseRecord)) {
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
