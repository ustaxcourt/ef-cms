const {
  Case,
  isAssociatedUser,
  isSealedCase,
} = require('../entities/cases/Case');
const {
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
} = require('../utilities/caseFilter');
const {
  getContactPrimary,
  getContactSecondary,
} = require('../entities/cases/Case');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { NotFoundError } = require('../../errors/errors');
const { PublicCase } = require('../entities/cases/PublicCase');
const { User } = require('../entities/User');

const isAuthorizedForContact = ({
  contact,
  currentUser,
  defaultValue,
  permission,
}) => {
  return !!(
    defaultValue ||
    (contact && isAuthorized(currentUser, permission, contact.contactId))
  );
};

exports.isAuthorizedForContact = isAuthorizedForContact;

const getSealedCase = async ({
  applicationContext,
  caseRecord,
  isAssociatedWithCase,
}) => {
  const currentUser = applicationContext.getCurrentUser();
  let isAuthorizedToViewSealedCase = isAuthorized(
    currentUser,
    ROLE_PERMISSIONS.VIEW_SEALED_CASE,
    getContactPrimary(caseRecord).contactId,
  );

  // check secondary contact if existent
  isAuthorizedToViewSealedCase = isAuthorizedForContact({
    contact: getContactSecondary(caseRecord),
    currentUser,
    defaultValue: isAuthorizedToViewSealedCase,
    permission: ROLE_PERMISSIONS.VIEW_SEALED_CASE,
  });

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

const getCaseForExternalUser = async ({
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
 * getCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get
 * @returns {object} the case data
 */
exports.getCaseInteractor = async (applicationContext, { docketNumber }) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: Case.formatDocketNumber(docketNumber),
    });

  if (!caseRecord.docketNumber && !caseRecord.entityName) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  const currentUser = applicationContext.getCurrentUser();
  let isAuthorizedToGetCase = isAuthorized(
    currentUser,
    ROLE_PERMISSIONS.GET_CASE,
    getContactPrimary(caseRecord).contactId,
  );

  // check secondary contact if existent
  isAuthorizedToGetCase = isAuthorizedForContact({
    contact: getContactSecondary(caseRecord),
    currentUser,
    defaultValue: isAuthorizedToGetCase,
    permission: ROLE_PERMISSIONS.GET_CASE,
  });

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
