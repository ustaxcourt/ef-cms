const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');
const { UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');

/**
 * generateDocketRecordPdfInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number for the docket record to be generated
 * @returns {Uint8Array} docket record pdf
 */
exports.generateDocketRecordPdfInteractor = async ({
  applicationContext,
  docketNumber,
  docketRecordSort,
  includePartyDetail = false,
}) => {
  const user = applicationContext.getCurrentUser();
  const isAssociated = await applicationContext
    .getPersistenceGateway()
    .verifyCaseForUser({
      applicationContext,
      docketNumber,
      userId: user.userId,
    });
  const isInternal = User.isInternalUser(user.role);

  const shouldIncludePartyDetail =
    includePartyDetail && (isAssociated || isInternal);

  const caseSource = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  let caseEntity;
  if (caseSource.sealedDate) {
    if (user && user.userId) {
      const isAuthorizedToViewSealedCase = isAuthorized(
        user,
        ROLE_PERMISSIONS.VIEW_SEALED_CASE,
        caseSource.userId,
      );

      if (isAuthorizedToViewSealedCase || isAssociated) {
        caseEntity = new Case(caseSource, { applicationContext });
      } else {
        // unassociated user viewing sealed case
        throw new UnauthorizedError('Unauthorized to view sealed case.');
      }
    } else {
      //public user
      throw new UnauthorizedError('Unauthorized to view sealed case.');
    }
  } else {
    caseEntity = new Case(caseSource, { applicationContext });
  }

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      caseDetail: caseEntity,
      docketRecordSort,
    });

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);

  const pdf = await applicationContext.getDocumentGenerators().docketRecord({
    applicationContext,
    data: {
      caseCaptionExtension,
      caseDetail: formattedCaseDetail,
      caseTitle,
      docketNumberWithSuffix: `${caseEntity.docketNumber}${
        caseEntity.docketNumberSuffix || ''
      }`,
      entries: formattedCaseDetail.formattedDocketEntries.filter(
        d => d.isOnDocketRecord,
      ),
      includePartyDetail: shouldIncludePartyDetail,
    },
  });

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file: pdf,
    useTempBucket: true,
  });
};
