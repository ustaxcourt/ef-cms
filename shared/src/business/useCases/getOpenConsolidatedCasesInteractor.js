const { Case } = require('../entities/cases/Case');
const { UserCase } = require('../entities/UserCase');

const garbage = openUserCases => {
  let casesThatAreNotLeadCasesOrLeadCasesAssociatedWithCurrentUserMap = {};
  let userCaseIdsMap = {};
  let leadCaseIdsToGet = [];

  openUserCases.forEach(caseRecord => {
    const { caseId, leadCaseId } = caseRecord;

    // case is associated with user because it was retrieved using getOpenCasesByUser!
    caseRecord.isRequestingUserAssociated = true;
    userCaseIdsMap[caseId] = true;

    if (!leadCaseId || leadCaseId === caseId) {
      casesThatAreNotLeadCasesOrLeadCasesAssociatedWithCurrentUserMap[
        caseId
      ] = caseRecord;
    }

    if (leadCaseId && !leadCaseIdsToGet.includes(leadCaseId)) {
      leadCaseIdsToGet.push(leadCaseId);
    }
  });

  return {
    casesThatAreNotLeadCasesOrLeadCasesAssociatedWithCurrentUserMap,
    leadCaseIdsToGet,
    userCaseIdsMap,
  };
};

/**
 * getOpenConsolidatedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the open cases data
 */
exports.getOpenConsolidatedCasesInteractor = async ({ applicationContext }) => {
  const { userId } = await applicationContext.getCurrentUser();

  const openUserCases = await applicationContext
    .getPersistenceGateway()
    .getOpenCasesByUser({ applicationContext, userId });

  const openUserCasesValidated = UserCase.validateRawCollection(openUserCases, {
    applicationContext,
  });

  if (!openUserCasesValidated.length) {
    return [];
  }

  const {
    casesThatAreNotLeadCasesOrLeadCasesAssociatedWithCurrentUserMap,
    leadCaseIdsToGet: leadCaseIdsAssociatedWithCurrentUser,
    userCaseIdsMap,
  } = garbage(openUserCasesValidated);

  for (const leadCaseId of leadCaseIdsAssociatedWithCurrentUser) {
    const consolidatedCases = await applicationContext
      .getPersistenceGateway()
      .getCasesByLeadCaseId({
        applicationContext,
        leadCaseId,
      });

    // USERCASE????
    const consolidatedCasesValidated = Case.validateRawCollection(
      consolidatedCases,
      { applicationContext, filtered: true },
    );

    if (
      !casesThatAreNotLeadCasesOrLeadCasesAssociatedWithCurrentUserMap[
        leadCaseId
      ]
    ) {
      const leadCase = consolidatedCasesValidated.find(
        consolidatedCase => consolidatedCase.caseId === leadCaseId,
      );
      leadCase.isRequestingUserAssociated = false;
      casesThatAreNotLeadCasesOrLeadCasesAssociatedWithCurrentUserMap[
        leadCaseId
      ] = leadCase;
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

    casesThatAreNotLeadCasesOrLeadCasesAssociatedWithCurrentUserMap[
      leadCaseId
    ].consolidatedCases = Case.sortByDocketNumber(caseConsolidatedCases);
  }

  const foundCases = Object.values(
    casesThatAreNotLeadCasesOrLeadCasesAssociatedWithCurrentUserMap,
  );

  return foundCases;
};
