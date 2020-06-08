const { Case } = require('../entities/cases/Case');
const { UserCase } = require('../entities/UserCase');

const addCaseToMap = ({ caseRecord, casesAssociatedWithUserOrLeadCaseMap }) => {
  casesAssociatedWithUserOrLeadCaseMap[caseRecord.caseId] = caseRecord;
};

const processUserAssociatedCases = openUserCases => {
  let casesAssociatedWithUserOrLeadCaseMap = {};
  let userAssociatedCaseIdsMap = {};
  let leadCaseIdsAssociatedWithUser = [];

  openUserCases.forEach(caseRecord => {
    const { caseId, leadCaseId } = caseRecord;
    const caseIsALeadCase = leadCaseId === caseId;

    caseRecord.isRequestingUserAssociated = true;
    userAssociatedCaseIdsMap[caseId] = true;

    if (!leadCaseId) {
      addCaseToMap({
        caseRecord,
        casesAssociatedWithUserOrLeadCaseMap,
      });
    }

    if (caseIsALeadCase) {
      addCaseToMap({
        caseRecord,
        casesAssociatedWithUserOrLeadCaseMap,
      });
    }

    if (leadCaseId && !leadCaseIdsAssociatedWithUser.includes(leadCaseId)) {
      leadCaseIdsAssociatedWithUser.push(leadCaseId);
    }
  });

  return {
    casesAssociatedWithUserOrLeadCaseMap,
    leadCaseIdsAssociatedWithUser,
    userAssociatedCaseIdsMap,
  };
};

const setUnassociatedLeadCase = ({
  casesAssociatedWithUserOrLeadCaseMap,
  consolidatedCases,
  leadCaseId,
}) => {
  const leadCase = consolidatedCases.find(
    consolidatedCase => consolidatedCase.caseId === leadCaseId,
  );
  leadCase.isRequestingUserAssociated = false;
  casesAssociatedWithUserOrLeadCaseMap[leadCaseId] = leadCase;
};

const getConsolidatedCasesForLeadCase = async ({
  applicationContext,
  casesAssociatedWithUserOrLeadCaseMap,
  leadCaseId,
  userAssociatedCaseIdsMap,
}) => {
  let consolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadCaseId({
      applicationContext,
      leadCaseId,
    });

  // USERCASE????
  consolidatedCases = Case.validateRawCollection(consolidatedCases, {
    applicationContext,
    filtered: true,
  });

  if (!casesAssociatedWithUserOrLeadCaseMap[leadCaseId]) {
    setUnassociatedLeadCase({
      casesAssociatedWithUserOrLeadCaseMap,
      consolidatedCases,
      leadCaseId,
    });
  }

  const caseConsolidatedCases = [];
  consolidatedCases.forEach(consolidatedCase => {
    consolidatedCase.isRequestingUserAssociated = !!userAssociatedCaseIdsMap[
      consolidatedCase.caseId
    ];

    if (consolidatedCase.caseId !== leadCaseId) {
      caseConsolidatedCases.push(consolidatedCase);
    }
  });

  return Case.sortByDocketNumber(caseConsolidatedCases);
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

  let openUserCases = await applicationContext
    .getPersistenceGateway()
    .getOpenCasesByUser({ applicationContext, userId });

  openUserCases = UserCase.validateRawCollection(openUserCases, {
    applicationContext,
  });

  if (!openUserCases.length) {
    return [];
  }

  const {
    casesAssociatedWithUserOrLeadCaseMap,
    leadCaseIdsAssociatedWithUser,
    userAssociatedCaseIdsMap,
  } = processUserAssociatedCases(openUserCases);

  for (const leadCaseId of leadCaseIdsAssociatedWithUser) {
    casesAssociatedWithUserOrLeadCaseMap[
      leadCaseId
    ].consolidatedCases = await getConsolidatedCasesForLeadCase({
      applicationContext,
      casesAssociatedWithUserOrLeadCaseMap,
      leadCaseId,
      userAssociatedCaseIdsMap,
    });
  }

  const foundCases = Object.values(casesAssociatedWithUserOrLeadCaseMap);

  return foundCases;
};
