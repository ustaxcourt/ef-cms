const { Case } = require('../entities/cases/Case');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');

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
  const caseSource = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseSource, { applicationContext });
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
      includePartyDetail,
    },
  });

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file: pdf,
    useTempBucket: true,
  });
};
