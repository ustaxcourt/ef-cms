const { Case } = require('../entities/cases/Case');

/**
 * getConsolidatedCasesByUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId id of the user to get cases for
 * @returns {Array<object>} the cases the user is associated with
 */
exports.getConsolidatedCasesByUserInteractor = async ({
  applicationContext,
  userId,
}) => {
  let foundCases = [];
  let userCaseIdsMap = {};

  const userCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByUser({ applicationContext, userId });

  const userCasesValidated = Case.validateRawCollection(userCases, {
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
