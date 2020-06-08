const { Case } = require('../entities/cases/Case');
const { UserCase } = require('../entities/UserCase');

const addCaseToMap = ({
  caseRecord,
  casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap,
}) => {
  casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap[
    caseRecord.caseId
  ] = caseRecord;
};

const garbage = openUserCases => {
  let casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap = {};
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
        casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap,
      });
    }

    if (caseIsALeadCase) {
      addCaseToMap({
        caseRecord,
        casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap,
      });
    }

    if (leadCaseId && !leadCaseIdsAssociatedWithUser.includes(leadCaseId)) {
      leadCaseIdsAssociatedWithUser.push(leadCaseId);
    }
  });

  return {
    casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap,
    leadCaseIdsAssociatedWithUser,
    userAssociatedCaseIdsMap,
  };
};

const literallyAnythingElse = ({
  casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap,
  consolidatedCases,
  leadCaseId,
}) => {
  const leadCase = consolidatedCases.find(
    consolidatedCase => consolidatedCase.caseId === leadCaseId,
  );
  leadCase.isRequestingUserAssociated = false;
  casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap[
    leadCaseId
  ] = leadCase;
};

const getConsolidatedCasesForLeadCase = async ({
  applicationContext,
  casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap,
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

  if (!casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap[leadCaseId]) {
    literallyAnythingElse({
      casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap,
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
    casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap,
    leadCaseIdsAssociatedWithUser,
    userAssociatedCaseIdsMap,
  } = garbage(openUserCases);

  for (const leadCaseId of leadCaseIdsAssociatedWithUser) {
    casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap[
      leadCaseId
    ].consolidatedCases = await getConsolidatedCasesForLeadCase({
      applicationContext,
      casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap,
      leadCaseId,
      userAssociatedCaseIdsMap,
    });
  }

  const foundCases = Object.values(
    casesThatAreNotLeadCasesOrLeadCasesAssociatedWithUserMap,
  );

  return foundCases;
};
