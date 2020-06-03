const { Case } = require('../entities/cases/Case');

/**
 * getClosedConsolidatedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the open cases data
 */
exports.getClosedConsolidatedCasesInteractor = async ({
  applicationContext,
}) => {
  let openCases;
  let foundCases = [];
  let userCaseIdsMap = {};

  const { userId } = await applicationContext.getCurrentUser();

  openCases = await applicationContext
    .getPersistenceGateway()
    .getClosedCasesByUser({ applicationContext, userId });

  const userCasesValidated = Case.validateRawCollection(openCases, {
    applicationContext,
  });

  if (userCasesValidated.length) {
    const caseMapping = {};
    const leadCaseIdsToGet = [];

    userCasesValidated.forEach(caseRecord => {
      const { caseId, leadCaseId } = caseRecord;

      caseRecord.isRequestingUserAssociated = true;
      userCaseIdsMap[caseId] = true;

      if (!leadCaseId || leadCaseId === caseId) {
        caseMapping[caseId] = caseRecord;
      }

      if (leadCaseId) {
        if (leadCaseIdsToGet.indexOf(leadCaseId) === -1) {
          leadCaseIdsToGet.push(leadCaseId);
        }
      }
    });

    for (const leadCaseId of leadCaseIdsToGet) {
      const consolidatedCases = await applicationContext
        .getPersistenceGateway()
        .getCasesByLeadCaseId({
          applicationContext,
          leadCaseId,
        });

      const consolidatedCasesValidated = Case.validateRawCollection(
        consolidatedCases,
        { applicationContext, filtered: true },
      );

      if (!caseMapping[leadCaseId]) {
        const leadCase = consolidatedCasesValidated.find(
          consolidatedCase => consolidatedCase.caseId === leadCaseId,
        );
        leadCase.isRequestingUserAssociated = false;
        caseMapping[leadCaseId] = leadCase;
      }

      const caseConsolidatedCases = [];
      consolidatedCasesValidated.forEach(consolidatedCase => {
        consolidatedCase.isRequestingUserAssociated = !!userCaseIdsMap[
          consolidatedCase.caseId
        ];
        if (consolidatedCase.caseId !== leadCaseId) {
          caseConsolidatedCases.push(consolidatedCase);
        }
      });

      caseMapping[leadCaseId].consolidatedCases = Case.sortByDocketNumber(
        caseConsolidatedCases,
      );
    }

    foundCases = Object.keys(caseMapping).map(caseId => caseMapping[caseId]);
  }

  return foundCases;
};
