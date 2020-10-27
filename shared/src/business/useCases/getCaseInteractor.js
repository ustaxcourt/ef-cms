const {
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
} = require('../utilities/caseFilter');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case, isAssociatedUser } = require('../entities/cases/Case');
const { NotFoundError } = require('../../errors/errors');
const { PublicCase } = require('../entities/cases/PublicCase');
const { User } = require('../entities/User');

const getDocumentContentsForDocuments = async ({
  applicationContext,
  docketEntries,
}) => {
  for (const document of docketEntries) {
    if (document.documentContentsId) {
      try {
        const documentContentsFile = await applicationContext
          .getPersistenceGateway()
          .getDocument({
            applicationContext,
            key: document.documentContentsId,
            protocol: 'S3',
            useTempBucket: false,
          });

        const documentContentsData = JSON.parse(
          documentContentsFile.toString(),
        );
        document.documentContents = documentContentsData.documentContents;
        document.draftOrderState = {
          ...document.draftOrderState,
          documentContents: documentContentsData.documentContents,
          richText: documentContentsData.richText,
        };
      } catch (e) {
        applicationContext.logger.error(
          `Document contents ${document.documentContentsId} could not be found in the S3 bucket.`,
        );
      }
    }
  }

  return docketEntries;
};

const getCaseAndDocumentContents = async ({
  applicationContext,
  caseRecord,
}) => {
  const caseDetailRaw = new Case(caseRecord, {
    applicationContext,
  })
    .validate()
    .toRawObject();

  caseDetailRaw.docketEntries = await getDocumentContentsForDocuments({
    applicationContext,
    docketEntries: caseDetailRaw.docketEntries,
  });

  return caseDetailRaw;
};

const getSealedCase = async ({
  applicationContext,
  caseRecord,
  isAssociatedWithCase,
}) => {
  const currentUser = applicationContext.getCurrentUser();
  const isAuthorizedToViewSealedCase = isAuthorized(
    currentUser,
    ROLE_PERMISSIONS.VIEW_SEALED_CASE,
    caseRecord.userId,
  );

  if (isAuthorizedToViewSealedCase || isAssociatedWithCase) {
    return await getCaseAndDocumentContents({
      applicationContext,
      caseRecord,
    });
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
    return await getCaseAndDocumentContents({ applicationContext, caseRecord });
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
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to get
 * @returns {object} the case data
 */
exports.getCaseInteractor = async ({ applicationContext, docketNumber }) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: Case.stripLeadingZeros(docketNumber),
    });

  if (!caseRecord.docketNumber && !caseRecord.entityName) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  const currentUser = applicationContext.getCurrentUser();
  const isAuthorizedToGetCase = isAuthorized(
    currentUser,
    ROLE_PERMISSIONS.GET_CASE,
    caseRecord.userId,
  );
  const isAssociatedWithCase = isAssociatedUser({
    caseRaw: caseRecord,
    user: currentUser,
  });

  let caseDetailRaw;
  if (caseRecord.sealedDate) {
    caseDetailRaw = await getSealedCase({
      applicationContext,
      caseRecord,
      isAssociatedWithCase,
    });
  } else {
    const userRole = applicationContext.getCurrentUser().role;
    const isInternalUser = User.isInternalUser(userRole);

    if (isInternalUser) {
      caseDetailRaw = await getCaseAndDocumentContents({
        applicationContext,
        caseRecord,
      });
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
